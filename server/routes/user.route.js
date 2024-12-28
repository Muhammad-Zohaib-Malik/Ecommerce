import express from 'express';
import {
  getUserProfileController,
  loginController,
  registerController,
} from '../controllers/user.controller.js';
import { verify } from '../middlewares/auth.middleware.js';
const userRouter = express.Router();

userRouter.post('/register', registerController);
userRouter.post('/login', loginController);
userRouter.get('/profile', verify, getUserProfileController);

export default userRouter;
