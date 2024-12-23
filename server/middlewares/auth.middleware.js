import { User } from '../models/user.model.js';
import { ApiError } from '../utils/ApiError.js';
import jwt from 'jsonwebtoken';

export const verify = async (req, _) => {
  try {
    const token = req.cookies?.accessToken;
    if (!token) {
      throw new ApiError(400, 'Unauthorized User');
    }
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decodedToken._id);
    req.user = user;
    next();
  } catch (error) {}
};
