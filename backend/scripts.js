// const axios = require('axios');
// const mongoose = require('mongoose');
// require('dotenv').config();

// // Connect function
// const connectDB = require('./connect/connect');

// // Product schema
// const productSchema = new mongoose.Schema({
//   id: Number,
//   title: String,
//   description: String,
//   price: Number,
//   discountPercentage: Number,
//   rating: Number,
//   stock: Number,
//   brand: String,
//   category: String,
//   thumbnail: String,
//   images: [String]
// });

// // Use specific collection name
// const Product = mongoose.model('Product', productSchema, 'main-products');

// const seedProducts = async () => {
//   try {
//     await connectDB(process.env.MONGO_URI);

//     console.log('🔗 Connected to MongoDB... Fetching products...');
//     const response = await axios.get('https://dummyjson.com/products?limit=0');
//     const products = response.data.products;

//     console.log(`🧹 Clearing 'main-products' collection...`);
//     await Product.deleteMany({});

//     console.log(`⬇️ Inserting ${products.length} products...`);
//     await Product.insertMany(products);

//     console.log(`✅ Products inserted successfully.`);
//     process.exit(0);
//   } catch (err) {
//     console.error('❌ Error:', err.message);
//     process.exit(1);
//   }
// };

// seedProducts();
