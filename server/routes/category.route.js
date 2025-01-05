import express from 'express';

import { verify } from '../middlewares/auth.middleware.js';
import {
  createCategory,
  deleteCategoryController,
  getCategoryController,
} from '../controllers/category.controller.js';
const categoryRouter = express.Router();

categoryRouter.post('/create', verify, createCategory);
categoryRouter.get('/get-all', getCategoryController);
categoryRouter.delete('/delete/:id', verify, deleteCategoryController);

export default categoryRouter;
