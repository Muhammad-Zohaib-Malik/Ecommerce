import express from 'express';
import { verify } from '../middlewares/auth.middleware.js';
import {
  createOrderController,
  // getOrderController,
  // getAllOrdersController,
  // updateOrderStatusController,
  // deleteOrderController,
} from '../controllers/order.controller.js';

const orderRouter = express.Router();

orderRouter.post('/create', verify, createOrderController);
// orderRouter.get('/:id', verify, getOrderController);
// orderRouter.get('/get-all', verify, getAllOrdersController);
// orderRouter.put('/update-status/:id', verify, updateOrderStatusController);
// orderRouter.delete('/:id', verify, deleteOrderController);

export default orderRouter;
