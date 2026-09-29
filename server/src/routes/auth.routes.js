import express from 'express';
import { loginUser, logoutUser, refreshAccessToken, registerUser, requestPasswordReset, resetPassword } from '../controllers/auth.controller.js';
import { verifyJwt } from '../middleware/auth.middleware.js';
import upload from '../middleware/upload.middleware.js';

const authRouter = express.Router();

authRouter.post('/register',upload.single("profilePhoto"), registerUser);
authRouter.post('/login', loginUser);
authRouter.post('/logout', logoutUser);
authRouter.post('/refresh', refreshAccessToken);
authRouter.post('/forgot-password', requestPasswordReset);
authRouter.post('/reset-password', resetPassword);
authRouter.get('/me', verifyJwt, (req,res) => {
  res.status(200).json({
    success: true,
    data: req.user
  })
});
export default authRouter;