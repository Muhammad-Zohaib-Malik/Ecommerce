import express from 'express';

import { verify } from '../middlewares/auth.middleware.js';
import { createCategory } from '../controllers/category.controller.js';
const categoryRouter = express.Router();

categoryRouter.post('/create', verify, createCategory);
categoryRouter.get('/get-all', getCategory);

export default categoryRouter;
