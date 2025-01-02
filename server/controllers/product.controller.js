import { Product } from '../models/product.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import mongoose from 'mongoose';

export const getAllProductsController = asyncHandler(async (req, res) => {
  const products = await Product.find({});

  return res
    .status(200)
    .json(new ApiResponse(200, products, 'all products fetched successfully'));
});

export const getSingleProductsController = asyncHandler(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    throw new ApiError(400, 'Invalid product ID format');
  }

  const product = await Product.findById(req.params.id);
  if (!product) {
    throw new ApiError(404, 'Product Not Found');
  }

  return res
    .status(200)
    .json(new ApiResponse(200, product, 'Product fetched successfully'));
});
