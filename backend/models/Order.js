const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    products: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        quantity: Number,
      },
    ],
    shippingInfo: {
      firstName: String,
      lastName: String,
      address: String,
      apartment: String,
      city: String,
      state: String,
      country: String,
      zipcode: String,
    },
    contactEmail: {
      type: String,
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid'],
      default: 'pending',
    },
    totalAmount: Number,
    shippingFee: Number,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
