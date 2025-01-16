import express from 'express';
import { isAdmin, verify } from '../middlewares/auth.middleware.js';
import {
  createOrderController,
  getMyOrderController,
  getSingleOrderController,
  // getOrderController,
  // getAllOrdersController,
  // updateOrderStatusController,
  // deleteOrderController,
} from '../controllers/order.controller.js';

const orderRouter = express.Router();

orderRouter.post('/create', verify, createOrderController);
orderRouter.get('/my-orders', verify, getMyOrderController);
orderRouter.get('/my-orders/:id', verify, getSingleOrderController);

// orderRouter.get('/get-all', verify, getAllOrdersController);
// orderRouter.put('/update-status/:id', verify, updateOrderStatusController);
// orderRouter.delete('/:id', verify, deleteOrderController);

export default orderRouter;
