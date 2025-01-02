import express from 'express';
import {
  getAllProductsController,
  getSingleProductsController,
} from '../controllers/product.controller.js';

const productRouter = express.Router();

productRouter.get('/get-all', getAllProductsController);
productRouter.get('/:id', getSingleProductsController);

export default productRouter;
