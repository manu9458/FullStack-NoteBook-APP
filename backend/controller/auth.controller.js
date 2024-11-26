import User from "../modals/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import twilio from "twilio";

// Twilio Configuration
const client = twilio("AC4259f5159d1d5e5c9c5d35154b3e54e9", "1ad0cf1f72ed314e485a447af700ff5b");

// Temporary OTP store (use Redis or similar in production)
const otpStore = {};

// Signup Handler
const signuphandler = async (req, res, next) => {
    const { username, email, password, phoneNumber } = req.body;

    try {
        const isValid = await User.findOne({ email: email });

        if (isValid) {
            return res.status(400).json({ message: "Email already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            phoneNumber, // Save phone number during signup
        });

        await newUser.save();
        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        next(error); // Pass errors to the error-handling middleware
    }
};

// Signin Handler with 2FA OTP
const signinhandler = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        // Find the user by email
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Compare the provided password with the hashed password in the database
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Check if the user has a phone number
        if (!user.phoneNumber) {
            return res.status(400).json({ message: "No phone number associated with this account." });
        }

        // Generate a 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000);
        otpStore[email] = { otp, expiresAt: Date.now() + 5 * 60 * 1000 }; // Valid for 5 minutes

        // Send OTP via Twilio
        await client.messages.create({
            body: `Your login OTP is: ${otp}`,
            from: '+1 681 230 5943',
            to: user.phoneNumber,
        });

        res.status(200).json({ message: "OTP sent successfully!" });
    } catch (error) {
        next(error); // Pass errors to the error-handling middleware
    }
};

// OTP Verification Handler
const verifyOtp = async (req, res, next) => {
    const { email, otp } = req.body;

    try {
        const otpData = otpStore[email];

        // Check if OTP exists and is valid
        if (!otpData || otpData.expiresAt < Date.now()) {
            return res.status(400).json({ message: "OTP is invalid or expired." });
        }

        if (otpData.otp !== parseInt(otp)) {
            return res.status(400).json({ message: "Invalid OTP." });
        }

        // OTP is valid; clear it from the store
        delete otpStore[email];

        // Generate JWT token
        const user = await User.findOne({ email: email });
        const token = jwt.sign(
            { id: user._id, email: user.email, username: user.username },
            process.env.JWT_SECRET, // Use your secret key
            { expiresIn: "1h" } // Token expiration time
        );

        // Set the JWT token in a cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 3600000, // 1 hour
            sameSite: "strict",
        });

        res.status(200).json({ message: "Login successful with OTP verification", user: { email: user.email, username: user.username } });
    } catch (error) {
        next(error); // Pass errors to the error-handling middleware
    }
};

// Update Phone Number Handler
const updatePhoneNumber = async (req, res, next) => {
    const { email, phoneNumber } = req.body;

    try {
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.phoneNumber = phoneNumber;
        user.isPhoneVerified = false; // Reset verification status
        await user.save();

        res.status(200).json({ message: "Phone number updated successfully." });
    } catch (error) {
        next(error); // Pass errors to the error-handling middleware
    }
};

// Signout Handler
const signouthandler = async (req, res, next) => {
    try {
        // Clear the token cookie to log out the user
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        });

        res.status(200).json({ message: "User logged out successfully" });
    } catch (error) {
        next(error); // Pass errors to the error-handling middleware
    }
};

// Export named functions
export { signuphandler, signinhandler, verifyOtp, signouthandler, updatePhoneNumber };
