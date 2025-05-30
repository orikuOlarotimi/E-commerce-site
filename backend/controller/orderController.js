const Order = require('../models/Order');

// @desc   Create a new order
// @route  POST /api/orders
// @access Private
const createOrder = async (req, res) => {
  try {
    const {
      products,
      shippingInfo,
      contactEmail,
      totalAmount,
      shippingFee,
      paymentStatus,
      paidAt,
      user, // coming from frontend
    } = req.body;

    const order = new Order({
      user, // or req.user._id if you're using middleware
      products,
      shippingInfo,
      contactEmail,
      totalAmount,
      shippingFee,
      paymentStatus,
      paidAt,
    });

    const savedOrder = await order.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    console.error('Checkout Error:', error);
    res.status(500).json({ message: 'Checkout failed' });
  }
};

module.exports = {
  createOrder,
};
