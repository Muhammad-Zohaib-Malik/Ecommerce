import { Product } from '../models/product.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import mongoose from 'mongoose';
import {
  deleteImageFromCloudinary,
  uploadOnCloudinary,
} from '../utils/cloudinary.js';
import fs from 'fs';

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

export const createProductController = asyncHandler(async (req, res) => {
  const { name, description, price, category, stock } = req.body;
  const images = req.files;

  // Validate required fields
  if (
    [name, description, price, category, stock].some(
      (field) => field?.trim() === ''
    )
  ) {
    throw new ApiError(404, 'All fields are required');
  }

  // Upload images to Cloudinary
  const uploadedImages = [];
  const uploadedImageIds = [];

  for (const file of images) {
    const { path } = file;
    const result = await uploadOnCloudinary(path);
    uploadedImages.push(result.secure_url);
    uploadedImageIds.push(result.public_id);
    fs.unlinkSync(path); // Remove file from server after upload
  }

  // Create new product
  const newProduct = new Product({
    name,
    description,
    price,
    category,
    stock,
    images: uploadedImages,
    imageId: uploadedImageIds,
  });

  await newProduct.save();

  return res
    .status(201)
    .json(new ApiResponse(201, newProduct, 'Product created successfully'));
});

export const updateProductController = asyncHandler(async (req, res) => {
  const { name, description, price, category, stock } = req.body;

  // Validate required fields
  if (
    [name, description, price, category, stock].some(
      (field) => field?.trim() === ''
    )
  ) {
    throw new ApiError(404, 'All fields are required');
  }

  // Find the existing product
  const product = await Product.findById(req.params.id);
  if (!product) {
    throw new ApiError(404, 'Product not found');
  }

  // Update product details if provided
  if (name) product.name = name;
  if (description) product.description = description;
  if (price) product.price = price;
  if (category) product.category = category;
  if (stock) product.stock = stock;

  await product.save();

  return res
    .status(200)
    .json(new ApiResponse(200, product, 'Product updated successfully'));
});

export const updateImageProductController = asyncHandler(async (req, res) => {
  const images = req.files;
  const product = await Product.findById(req.params.id);
  if (!product) {
    throw new ApiError(404, 'Product not found');
  }
  for (const imageId of product.imageId) {
    await deleteImageFromCloudinary(imageId);
  }

  // Upload new images to Cloudinary
  const uploadedImages = [];
  const uploadedImageIds = [];

  for (const file of images) {
    const { path } = file;
    const result = await uploadOnCloudinary(path);
    uploadedImages.push(result.secure_url);
    uploadedImageIds.push(result.public_id);
    fs.unlinkSync(path); // Remove file from server after upload
  }

  // Delete the old images from the database
  product.images = [];
  product.imageId = [];

  // Add new images to the database
  product.images = uploadedImages;
  product.imageId = uploadedImageIds;

  await product.save();
  return res
    .status(200)
    .json(new ApiResponse(200, product, 'Product Image updated successfully'));
});

export const deleteImageProductController = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) {
    throw new ApiError(404, 'Product not found');
  }

  // Delete images from Cloudinary
  for (const imageId of product.imageId) {
    await deleteImageFromCloudinary(imageId);
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, null, 'Product and images deleted successfully')
    );
});
