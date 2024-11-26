import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String, // New field for storing the user's phone number
        required: false,
    },
    isPhoneVerified: {
        type: Boolean, // Indicates whether the phone number is verified
        default: false,
    },
    date: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.model("User", userSchema);
