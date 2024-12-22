import { User } from '../models/user.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';

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

  const accessToken = user.generateAccessToken();

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
