import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { Category } from '../models/category.model.js';
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
