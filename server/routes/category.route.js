import express from 'express';

import { verify } from '../middlewares/auth.middleware.js';
import {
  createCategory,
  deleteCategoryController,
  getCategoryController,
  updateCategoryController,
} from '../controllers/category.controller.js';
const categoryRouter = express.Router();

categoryRouter.post('/create', verify, createCategory);
categoryRouter.get('/get-all', getCategoryController);
categoryRouter.delete('/delete/:id', verify, deleteCategoryController);
categoryRouter.put('/update/:id', verify, updateCategoryController); // product Id

export default categoryRouter;
