import User from "../modals/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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

// Signin Handler without OTP
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

        // Generate JWT token
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

        res.status(200).json({ message: "Login successful", user: { email: user.email, username: user.username } });
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
export { signuphandler, signinhandler, signouthandler, updatePhoneNumber };
