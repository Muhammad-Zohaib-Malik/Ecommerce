import { Order } from '../models/order.model.js';
import { Product } from '../models/product.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';

import { asyncHandler } from '../utils/asyncHandler.js';

export const createOrderController = asyncHandler(async (req, res) => {
  const {
    shippingInfo,
    orderItems,
    paymentMethod,
    paymentInfo,
    itemPrice,
    tax,
    shippingCharges,
    totalAmount,
  } = req.body;

  if (
    [
      shippingInfo,
      orderItems,
      paymentMethod,
      paymentInfo,
      itemPrice,
      tax,
      shippingCharges,
      totalAmount,
    ].some((field) => field.trim() === '')
  ) {
    throw new ApiError(400, 'All fields are required');
  }

  const order = await Order.create({
    user: req.user._id,
    shippingInfo,
    orderItems,
    paymentMethod,
    paymentInfo,
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
    .json(new ApiResponse(200, product, 'Order Placed Successfully'));
});
