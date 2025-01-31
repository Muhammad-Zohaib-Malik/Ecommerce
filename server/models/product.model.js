import mongoose from 'mongoose';
import { review } from './review.model.js';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Product price is required'],
      min: [0, 'Product price must be a positive number'],
      default: 0,
    },
    stock: {
      type: Number,
      required: [true, 'Product stock is required'],
      min: [0, 'Product stock must be a positive number'],
      default: 0,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
    },
    images: [
      {
        type: String,
        required: [true, 'Product image URL is required'],
      },
    ],
    imageId: [
      {
        type: String,
        required: [true, 'Product image ID is required'],
      },
    ],
    reviews: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'review',
    },
    rating: {
      type: Number,
      default: 0,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export const Product = mongoose.model('Product', productSchema);
