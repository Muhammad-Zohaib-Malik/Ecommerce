import express from 'express';
import {
  createProductController,
  deleteImageProductController,
  getAllProductsController,
  getSingleProductsController,
  updateImageProductController,
  updateProductController,
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

productRouter.put(
  '/update-image/:id',
  verify,
  upload.array('images', 4),
  updateImageProductController
);

productRouter.put('/:id', verify, updateProductController);
productRouter.delete('/delete-image/:id', verify, deleteImageProductController);

export default productRouter;
