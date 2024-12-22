import express from 'express';
import { 
    signuphandler, 
    signinhandler, 
    signouthandler, 
    forgotPasswordRequest,
    verifyOtp,
} from '../controller/auth.controller.js';
const router = express.Router();
// Authentication Routes
router.post('/signup', signuphandler);
router.post('/signin', signinhandler);
router.post('/signout', signouthandler);
router.post('/send-otp', signinhandler); // Send OTP after login with email and password
router.post('/verify-otp', verifyOtp); // Verify OTP for login
router.post('/updatepassword', forgotPasswordRequest); // Allow users to update/add phone numbers

export default router;
