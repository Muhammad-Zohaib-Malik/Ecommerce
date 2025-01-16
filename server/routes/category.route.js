import express from 'express';

import { isAdmin, verify } from '../middlewares/auth.middleware.js';
import {
  createCategory,
  deleteCategoryController,
  getCategoryController,
  updateCategoryController,
} from '../controllers/category.controller.js';
const categoryRouter = express.Router();

categoryRouter.post('/create', verify, isAdmin, createCategory);
categoryRouter.get('/get-all', getCategoryController);
categoryRouter.delete('/delete/:id', verify, isAdmin, deleteCategoryController);
categoryRouter.put('/update/:id', verify, isAdmin, updateCategoryController); // product Id

export default categoryRouter;
