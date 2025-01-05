import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { Category } from '../models/category.model.js';
import { Product } from '../models/product.model.js';

import { ApiResponse } from '../utils/ApiResponse.js';

export const createCategory = asyncHandler(async (req, res) => {
  const { category } = req.body;

  if (!category) {
    throw new ApiError(404, 'Category not found');
  }

  const newCategory = await Category.create({
    category,
  });

  return res.json(
    new ApiResponse(200, newCategory, 'Category created Successfully')
  );
});

export const getCategoryController = asyncHandler(async (req, res) => {
  const category = await Category.find({});
  return res.json(
    new ApiResponse(200, category, 'Category fetched Successfully')
  );
});

export const deleteCategoryController = asyncHandler(async (req, res) => {
  const categoryId = req.params.id;

  if (!categoryId) {
    throw new ApiError(400, 'Category ID is required');
  }

  const category = await Category.findById(categoryId);

  if (!category) {
    throw new ApiError(404, 'Category not found');
  }

  await Product.updateMany(
    { category: categoryId },
    { $unset: { category: '' } }
  );

  await Category.findByIdAndDelete(category);

  return res.json(new ApiResponse(200, null, 'Category deleted successfully'));
});

export const updateCategoryController = asyncHandler(async (req, res) => {
  const productId = req.params.id; // Product ID from the route
  const { categoryId } = req.body; // Category ID to associate

  if (!productId) {
    throw new ApiError(400, 'Product ID is required');
  }

  if (!categoryId) {
    throw new ApiError(400, 'Category ID is required');
  }

  // Check if the category exists
  const category = await Category.findById(categoryId);
  if (!category) {
    throw new ApiError(404, 'Category not found');
  }

  const product = await Product.findById(productId);
  if (!product) {
    throw new ApiError(404, 'Product not found');
  }

  product.category = categoryId;
  await product.save();

  return res.json(
    new ApiResponse(200, product, 'Category assigned to product successfully')
  );
});
