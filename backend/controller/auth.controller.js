import User from "../modals/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import twilio from "twilio";
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';

// Debug: Print current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
console.log('Current directory:', __dirname);

// Try multiple possible paths
const envPaths = [
    path.resolve(__dirname, '../../.env'),
    path.resolve(__dirname, '../.env'),
    path.resolve(__dirname, '.env')
];

// Load environment variables
let loaded = false;
for (const envPath of envPaths) {
    console.log('Trying path:', envPath);
    const result = dotenv.config({ path: envPath });
    if (!result.error) {
        console.log('Loaded env from:', envPath);
        loaded = true;
        break;
    }
}

if (!loaded) {
    throw new Error('Could not load .env file');
}

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

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
        console.log("Sign-in email:", email); // Debug email

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

        console.log("User found:", user); // Debug user

        // Generate a 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000);
        otpStore[email] = { otp, expiresAt: Date.now() + 5 * 60 * 1000 }; // Valid for 5 minutes

        console.log("Stored OTP for email:", otpStore[email]); // Debug OTP storage

        // Send OTP via Twilio
        await client.messages.create({
            body: `Your login OTP is: ${otp}`,
            from: '+1 681 230 5943',
            to: user.phoneNumber,
        });

        console.log("OTP sent to:", user.phoneNumber); // Debug phone number
        res.status(200).json({ message: "OTP sent successfully!" });
    } catch (error) {
        next(error); // Pass errors to the error-handling middleware
    }
};

// OTP Verification Handler
const verifyOtp = async (req, res, next) => {
    const { email, otp } = req.body;

    try {
        console.log("Received email:", email);
        console.log("Received OTP:", otp);

        const otpData = otpStore[email];
        console.log("Stored OTP:", otpData);

        if (!otpData || otpData.expiresAt < Date.now()) {
            return res.status(400).json({ message: "OTP is invalid or expired." });
        }

        if (otpData.otp !== parseInt(otp)) {
            console.log("OTP mismatch: Received:", otp, "Stored:", otpData.otp);
            return res.status(400).json({ message: "Invalid OTP." });
        }

        console.log("OTP validated successfully for email:", email);
        delete otpStore[email];

        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        console.log("User details:", user);

        const token = jwt.sign(
            { id: user._id, email: user.email, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );
        console.log("Generated JWT:", token);

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 3600000,
            sameSite: "strict",
        });
        console.log("JWT token set in cookie:", token);

        res.status(200).json({ message: "Login successful with OTP verification", user: { email: user.email, username: user.username } });
    } catch (error) {
        next(error);
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