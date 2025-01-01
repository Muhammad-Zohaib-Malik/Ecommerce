import express from 'express';
import {
  getUserProfileController,
  loginController,
  logoutController,
  registerController,
} from '../controllers/user.controller.js';
import { verify } from '../middlewares/auth.middleware.js';
const userRouter = express.Router();

userRouter.post('/register', registerController);
userRouter.post('/login', loginController);
userRouter.get('/profile', verify, getUserProfileController);
userRouter.get('/logout', logoutController);


export default userRouter;
