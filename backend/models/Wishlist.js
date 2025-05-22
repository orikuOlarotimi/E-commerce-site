const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true, // optional: only one wishlist per user
  },
  products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
    },
  ],
}, { timestamps: true });

    wishlistSchema.index({ userId: 1, productId: 1 }, { unique: true });


const Wishlist = mongoose.model('Wishlist', wishlistSchema);

module.exports = Wishlist;