import express from 'express';
import { isAdmin, verify } from '../middlewares/auth.middleware.js';
import {
  changeOrderStausController,
  createOrderController,
  getAllOrderController,
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

// admin
orderRouter.get(
  '/admin/get-all-orders',
  verify,
  isAdmin,
  getAllOrderController
);

//change order status
orderRouter.put(
  '/admin/order/:id',
  verify,
  isAdmin,
  changeOrderStausController
);

export default orderRouter;
