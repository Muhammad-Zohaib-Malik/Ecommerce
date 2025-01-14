import { User } from '../models/user.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import {
  deleteImageFromCloudinary,
  uploadOnCloudinary,
} from '../utils/cloudinary.js';
import fs from 'fs';

const generateAccess = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    const accessToken = await user.generateAccessToken();
    return accessToken;
  } catch (error) {
    throw new ApiError(500, 'Something went wrong while generating access');
  }
};

export const registerController = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if ([name, email, password].some((field) => field?.trim() === '')) {
    throw new ApiError(400, 'All fields are required');
  }

  const existedUser = await User.findOne({ email });
  if (existedUser) {
    throw new ApiError(409, 'User with email already exits');
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  const createdUser = await User.findById(user._id).select('-password');

  if (!createdUser) {
    throw new ApiError(500, 'Something went wrong while registering user');
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, 'User registered Successfully'));
});

export const loginController = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new ApiError(400, 'email and password is required');
  }
  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, 'user does not exists');
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, 'Invalid user credentials');
  }

  const accessToken = await generateAccess(user._id);
  console.log('Access Token:', accessToken);

  const loggedInUser = await User.findById(user._id).select('-password');

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie('accessToken', accessToken, options)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, accessToken },
        'User loggedIn successfully'
      )
    );
});

export const logoutController = asyncHandler(async (_, res) => {
  const options = {
    httpOnly: true,
    secure: true,
    maxAge: 0,
  };

  res.clearCookie('accessToken', options);
  return res
    .status(200)
    .json(new ApiResponse(200, {}, 'User logged out successfully'));
});

export const getUserProfileController = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  if (!user) {
    throw new ApiError(400, 'User not found');
  }

  return res
    .status(200)
    .json(new ApiResponse(200, user, 'User fetched successfully'));
});

export const updateProfileController = asyncHandler(async (req, res) => {
  const { name, email } = req.body;

  const user = await User.findById(req.user._id);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  user.name = name || user.name;
  user.email = email || user.email;

  await user.save();

  return res
    .status(200)
    .json(new ApiResponse(200, user, 'User Profile updates successfully'));
});

export const updatePasswordController = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const user = await User.findById(req.user._id);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  if (!oldPassword || !newPassword) {
    throw new ApiError(400, 'All fields are required');
  }

  const isPasswordValid = await user.isPasswordCorrect(oldPassword);

  if (!isPasswordValid) {
    throw new ApiError('400', 'Invalid Old Password');
  }

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, 'Password Changed Successfully'));
});

export const updateProfilePicController = asyncHandler(async (req, res) => {
  const profilePic = req.file;
  const user = await User.findById(req.user._id);

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  if (profilePic) {
    // Log the file path for debugging
    console.log('Uploaded file path:', profilePic.path);

    // Delete the old profile picture from Cloudinary if it exists
    if (user.profilePicId) {
      try {
        await deleteImageFromCloudinary(user.profilePicId);
      } catch (error) {
        console.error('Error deleting existing profile picture:', error);
      }
    }

    // Attempt to upload the new profile picture to Cloudinary
    try {
      const uploadResult = await uploadOnCloudinary(profilePic.path);

      if (!uploadResult) {
        throw new Error('Cloudinary upload returned undefined.');
      }

      const { secure_url, public_id } = uploadResult;

      // Update user's profile picture details
      user.profilePic = secure_url;
      user.profilePicId = public_id;

      fs.unlinkSync(profilePic.path);
    } catch (error) {
      console.error('Error uploading profile picture to Cloudinary:', error);
      throw new ApiError(500, 'Failed to upload profile picture');
    }
  }

  await user.save();

  return res
    .status(200)
    .json(new ApiResponse(200, user, 'Profile Pic Updated'));
});
