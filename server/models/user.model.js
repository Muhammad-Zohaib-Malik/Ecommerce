import mongoose from 'mongoose';
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'email is required'],
      unique: [true, 'email already taken'],
    },
    password: {
      type: String,
      required: [true, 'password is required'],
      minLength: [6, 'password length should be greater then 6 character'],
    },
    address: {
      type: String,
      required: [true, 'address is required'],
      trim: true,
    },
    city: {
      type: String,
      required: [true, 'city name is required'],
      trim: true,
    },
    country: {
      type: String,
      required: [true, 'country name is required'],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'phone no is required'],
      trim: true,
    },
    profilePic: {
      public_id: {
        type: String,
      },
      url: {
        type: String,
      },
    },
    answer: {
      type: String,
      required: [true, 'answer is required'],
    },
    role: {
      type: String,
      default: 'user',
    },
  },
  { timestamps: true }
);

export const User = mongoose.model('User', userSchema);
