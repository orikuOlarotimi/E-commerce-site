const Cart = require('../models/Cart');
const Product = require('../models/products');

// Get cart items
const getCart = async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
  res.json(cart ? cart.items : []);
};

// Add item to cart
const addToCart = async (req, res) => {
  const { productId, quantity } = req.body;

  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    cart = await Cart.create({ user: req.user._id, items: [] });
  }

  const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
  if (itemIndex > -1) {
    cart.items[itemIndex].quantity += quantity || 1;
  } else {
    cart.items.push({ product: productId, quantity: quantity || 1 });
  }

  await cart.save();
  res.json({ message: 'Item added to cart' });
};

// Remove item from cart
const removeFromCart = async (req, res) => {
  const { productId } = req.params;

  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) return res.status(404).json({ message: 'Cart not found' });

  cart.items = cart.items.filter(item => item.product.toString() !== productId);
  await cart.save();

  res.json({ message: 'Item removed from cart' });
};

// Update quantity
const updateCartItem = async (req, res) => {
  const { productId, quantity } = req.body;

  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) return res.status(404).json({ message: 'Cart not found' });

  const item = cart.items.find(item => item.product.toString() === productId);
  if (item) {
    item.quantity = quantity;
    await cart.save();
    return res.json({ message: 'Quantity updated' });
  }

  res.status(404).json({ message: 'Item not found in cart' });
};

module.exports = {
  getCart,
  addToCart,
  removeFromCart,
  updateCartItem,
};
