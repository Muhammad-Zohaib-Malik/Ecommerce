import mongoose from 'mongoose';

const orderSchmea = new mongoose.Schema({
  shippingInfo: {
    address: {
      type: String,
      required: [true, 'address is required'],
    },
    city: {
      type: String,
      required: [true, 'city is required'],
    },
    country: {
      type: String,
      required: [true, 'country is required'],
    },
  },

  orderItems: [
    {
      name: {
        type: String,
        required: [true, 'Product is required'],
      },
      price: {
        type: Number,
        required: [true, 'Product Price is required'],
      },
      quantity: {
        type: Number,
        required: [true, 'Product Quantity  is required'],
      },
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: [true, 'Product ID is required'],
      },
      images: [
        {
          type: String,
          required: [true, 'Product image URL is required'],
        },
      ],
    },
  ],

  paymentMethod: {
    type: String,
    enum: ['COD', 'ONLINE'],
    default: 'COD',
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'user Id is required'],
  },

  paidAt: Date,
  paymentInfo: {
    id: String,
    status: String,
  },
  itemPrice: {
    type: Number,
    required: [true, 'Item Price is required'],
  },
  tax: {
    type: Number,
    required: [true, 'tax Price is required'],
  },
  shippingCharges: {
    type: Number,
    required: [true, 'Item Shipping Charges is required'],
  },

  totalAmount: {
    type: Number,
    required: [true, 'Item total Amount  is required'],
  },
  orderStatus: {
    type: String,
    enum: ['processing', 'shipped', 'deliverd'],
    default: 'processing',
  },
  deliverdAt: Date,
});

export const Order = mongoose.model('Order', orderSchmea);
