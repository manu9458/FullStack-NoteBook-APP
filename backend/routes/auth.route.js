import express from 'express';
import { signuphandler, signinhandler, signouthandler } from '../controller/auth.controller.js';
import { OAuth2Client } from 'google-auth-library';
import User from '../modals/user.model.js';
const router = express.Router();

router.post('/signup', signuphandler);
router.post('/signin', signinhandler);
router.post('/signout', signouthandler); // Make sure this is added

const client = new OAuth2Client('153137155936-ad5tt92daavm89gs39ltsbmbbugnt4lk.apps.googleusercontent.com');

// Google login route
router.post('/google', async (req, res) => {
  const { token } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: '153137155936-ad5tt92daavm89gs39ltsbmbbugnt4lk.apps.googleusercontent.com',
    });

    const payload = ticket.getPayload();
    const email = payload.email;
    const name = payload.name;

    // Check if user exists or create a new user
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({ email, name });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Invalid Google token' });
  }
});

export default router;
