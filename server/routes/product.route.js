import express from 'express';
import {
  createProductController,
  getAllProductsController,
  getSingleProductsController,
} from '../controllers/product.controller.js';
import { verify } from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/multer.js';

const productRouter = express.Router();

productRouter.get('/get-all', getAllProductsController);
productRouter.get('/:id', getSingleProductsController);
productRouter.post(
  '/create',
  verify,
  upload.array('images', 4),
  createProductController
);

export default productRouter;
