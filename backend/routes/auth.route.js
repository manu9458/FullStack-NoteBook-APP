import express from 'express';
import { signuphandler, signinhandler, signouthandler } from '../controller/auth.controller.js';

const router = express.Router();

router.post('/signup', signuphandler);
router.post('/signin', signinhandler);
router.post('/signout', signouthandler); // Make sure this is added

export default router;
