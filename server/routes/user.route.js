import express from 'express';
import {
  getUserProfileController,
  loginController,
  logoutController,
  registerController,
  updatePasswordController,
  updateProfileController,
  updateProfilePicController,
} from '../controllers/user.controller.js';
import { verify } from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/multer.js';
const userRouter = express.Router();

userRouter.post('/register', registerController);
userRouter.post('/login', loginController);
userRouter.get('/profile', verify, getUserProfileController);
userRouter.get('/logout', logoutController);
userRouter.put('/update-profile', verify, updateProfileController);
userRouter.put('/update-password', verify, updatePasswordController);
userRouter.put(
  '/update-profile-pic',
  verify,
  upload.single('profilePic'),
  updateProfilePicController
);

export default userRouter;
