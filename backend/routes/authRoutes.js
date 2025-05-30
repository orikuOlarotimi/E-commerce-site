// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { createOrder,getUserOrders } = require('../controller/orderController');
const authMiddleware = require('../middleware/authMiddleware')

const {addToWishlist, getWishlist,removeFromWishlist} =  require('../controller/wishlistController')
const { signupUser, loginUser, logoutUser, getUserById } = require('../controller/authController');

const { getCategoriesWithInfo, getFeaturedProducts, getSingleProduct, getFamousProducts,
        getSpecialProducts, getTopRatedByCategory,getAllProducts
       } = require('../controller/productController');


const { getCart, addToCart, removeFromCart, updateCartItem } = require('../controller/cartController');

      router.post('/auth-status', authMiddleware, (req, res) =>
      {
        res.json({ status: true, user: req.user });
      });

      router.get("/my-orders", authMiddleware, getUserOrders);
      router.post('/', authMiddleware, createOrder);

          
      router.get('/', authMiddleware, getCart);
      router.post('/add', authMiddleware, addToCart);
      router.delete('/remove/:productId', authMiddleware, removeFromCart);
      router.put('/update', authMiddleware, updateCartItem);



router.post('/signup', signupUser);
router.post("/logout", logoutUser);
router.post('/login', loginUser);

// product routes
router.get('/categories', getCategoriesWithInfo);
router.get('/featured', getFeaturedProducts);
router.get('/famous', getFamousProducts);
router.get('/special', getSpecialProducts);
router.get("/popular", getTopRatedByCategory);
router.get('/all', getAllProducts);





router.post('/add-wishlist',authMiddleware, addToWishlist);
router.get('/get-wishlist',authMiddleware,  getWishlist);
router.delete('/remove-wishlist/:id', authMiddleware, removeFromWishlist);

router.get('/user/:id', getUserById);
router.get('/:id', getSingleProduct);


module.exports = router;
