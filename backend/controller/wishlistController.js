
const Wishlist =  require('../models/Wishlist.js');
const addToWishlist = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId } = req.body;

    console.log('productId from req.body:', productId);
    console.log('userId from req.user:', userId);

    let wishlist = await Wishlist.findOne({ user: userId });

    if (!wishlist) {
      wishlist = new Wishlist({ user: userId, products: [productId] });
    } else {
      // Fix: Compare ObjectIds properly
      const alreadyExists = wishlist.products.some(
        (p) => p.toString() === productId
      );

      if (!alreadyExists) {
        wishlist.products.push(productId);
      }
    }

    await wishlist.save();
    res.status(200).json({ message: "Product added to wishlist", wishlist });
  } catch (error) {
    console.error("Add to Wishlist Error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

  
  
  // Get wishlist items
const getWishlist = async (req, res) => {
    // console.log("✅ Wishlist route hit:", req.method, req.originalUrl);
    // console.log("User from token:", req.user);
    
  try {
    const userId = req.user._id;

    // Find the wishlist document for the user
    const wishlist = await Wishlist.findOne({ user: userId }).populate('products');

    if (!wishlist) {
      // If no wishlist found, return empty array
      return res.status(200).json([]);
    }

    // Return the populated products array
    res.status(200).json(wishlist.products);
  } catch (error) {
    console.error("Get Wishlist Error:", error);
    res.status(500).json({ message: 'Server error' });
  }
};
  
const removeFromWishlist = async (req, res) => {
  try {
    const userId = req.user._id;
    const productId = req.params.id;

    const wishlist = await Wishlist.findOneAndUpdate(
      { user: userId },
      { $pull: { products: productId } }, // Remove the product from the array
      { new: true } // Return the updated document
    );

    if (!wishlist) {
      return res.status(404).json({ message: "Wishlist not found" });
    }

    res.status(200).json({ message: "Removed from wishlist", wishlist });
  } catch (error) {
    console.error("Remove Wishlist Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

  
module.exports = {
    addToWishlist,
    getWishlist,
    removeFromWishlist
};
