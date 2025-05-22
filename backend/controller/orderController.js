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
    } = req.body;

    const order = new Order({
      user: req.user._id,
      products,
      shippingInfo,
      contactEmail,
      totalAmount,
      shippingFee,
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