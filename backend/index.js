// index.js
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./connect/connect');
const authRoutes = require('./routes/authRoutes');
const cookieParser = require("cookie-parser");
const wishlistRoutes = require('./routes/authRoutes')
const cartRoute = require('./routes/authRoutes');
const orderRoutes = require('./routes/authRoutes');
const cors = require('cors');
dotenv.config();


const app = express();
const PORT = process.env.PORT || 5000;


// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(cookieParser());

// routes
app.use('/api/users', authRoutes);
app.use('/api/products', authRoutes);
app.use('/api/wishlist', wishlistRoutes)
app.use('/api/cart', cartRoute);
app.use('/api/orders', orderRoutes);



// Test route
app.get('/', (req, res) => {
  res.send('API is running...');
});


// Start server
app.listen(PORT, async () => {
  console.log(`🚀 Server running on port ${PORT}`); 
  // Now connect to MongoDB
  await connectDB(process.env.MONGO_URI);
});
