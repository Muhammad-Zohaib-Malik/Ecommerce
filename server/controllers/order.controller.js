import { Order } from '../models/order.model.js';
import { Product } from '../models/product.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';

import { asyncHandler } from '../utils/asyncHandler.js';

export const createOrderController = asyncHandler(async (req, res) => {
  const {
    shippingInfo,
    orderItems,
    itemPrice,
    tax,
    shippingCharges,
    totalAmount,
  } = req.body;

  if (
    !shippingInfo ||
    !orderItems ||
    !itemPrice ||
    !tax ||
    !shippingCharges ||
    !totalAmount
  ) {
    throw new ApiError(400, 'All fields are required');
  }

  const order = await Order.create({
    user: req.user._id,
    shippingInfo,
    orderItems,
    itemPrice,
    tax,
    shippingCharges,
    totalAmount,
  });

  for (let i = 0; i < orderItems.length; i++) {
    // find product
    const product = await Product.findById(orderItems[i].product);
    product.stock -= orderItems[i].quantity;
    await product.save();
  }
  res
    .status(201)
    .json(new ApiResponse(200, order, 'Order Placed Successfully'));
});

export const getMyOrderController = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id });

  if (!orders) {
    throw new ApiError(404, 'no orders found');
  }

  res
    .status(201)
    .json(new ApiResponse(200, orders, `orders :${orders.length}`));
});

export const getSingleOrderController = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    throw new ApiError(404, 'no orders found');
  }

  res.status(201).json(new ApiResponse(200, order, 'Order fetched'));
});

// admin controller

export const getAllOrderController = asyncHandler(async (req, res) => {
  const orders = await Order.find({});

  if (!orders) {
    throw new ApiError(404, 'no orders found');
  }

  res
    .status(201)
    .json(new ApiResponse(200, orders, `orders :${orders.length}`));
});

export const changeOrderStausController = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    throw new ApiError(404, 'no orders found');
  }

  if (order.orderStatus === 'processing') order.orderStatus = 'shipped';
  else if (order.orderStatus === 'shipped') {
    order.orderStatus = 'deliverd';
    order.deliverdAt = Date.now();
  } else {
    throw new ApiError(404, 'Order already deliverd');
  }

  await order.save();

  res.status(200).json(new ApiResponse(201, order, 'order status updated'));
});
