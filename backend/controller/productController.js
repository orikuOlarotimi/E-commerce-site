const Product = require('../models/products');
const Wishlist =  require('../models/Wishlist.js');


const getCategoriesWithInfo = async (req, res) => {
  try {
    const categories = await Product.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          image: { $first: '$thumbnail' }
        }
      },
      {
        $project: {
          _id: 0,
          category: '$_id',
          count: 1,
          image: 1
        }
      }
    ]);
    const categoriesWithId = categories.map((cat, index) => ({
        id: index + 1,
        ...cat
      }));
      res.status(200).json(categoriesWithId);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
};

const getFeaturedProducts = async (req, res) => {
    try {
      // Get 8 random categories
      const randomCategories = await Product.aggregate([
        { $group: { _id: '$category' } },
        { $sample: { size: 8 } } // randomly pick 8 categories
      ]);
  
      const categoryNames = randomCategories.map(cat => cat._id);
  
      // Get 1 product per category
      const featuredProducts = await Product.aggregate([
        { $match: { category: { $in: categoryNames } } },
        { $sort: { rating: -1 } }, // Optionally sort by rating or something else
        {
          $group: {
            _id: '$category',
            product: { $first: '$$ROOT' } // pick first product from each category
          }
        },
        {
          $replaceRoot: { newRoot: '$product' }
        },
        {
          $project: {
            _id: 1,
            title: 1,
            brand: 1,
            description: 1,
            rating: 1,
            price: 1,
            thumbnail: 1,
            category: 1
          }
        }
      ]);
  
      res.status(200).json(featuredProducts);
    } catch (error) {
      console.error('Error fetching featured products:', error);
      res.status(500).json({ error: 'Failed to fetch featured products' });
    }
};
  
const getSingleProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error });
  }
};

const getFamousProducts = async (req, res) => {
  try {
    const randomCategories = await Product.aggregate([
      { $group: { _id: '$category' } },
      { $sample: { size: 3 } }
    ]);

    const categoryNames = randomCategories.map(cat => cat._id);

    const products = await Product.aggregate([
      { $match: { category: { $in: categoryNames } } },
      { $sort: { rating: -1 } },
      {
        $group: {
          _id: '$category',
          product: { $first: '$$ROOT' }
        }
      },
      { $replaceRoot: { newRoot: '$product' } },
      {
        $project: {
          title: 1,
          price: 1,
          discountPercentage: 1,
          thumbnail: 1,
          category: 1
        }
      }
    ]);

    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to load famous products' });
  }
};

const getSpecialProducts = async (req, res) => {
  try {
    const categories = await Product.aggregate([
      { $group: { _id: '$category' } },
      { $sample: { size: 4 } }
    ]);

    const categoryNames = categories.map(cat => cat._id);

    const specialProducts = await Product.aggregate([
      { $match: { category: { $in: categoryNames } } },
      { $sort: { price: -1 } },
      {
        $group: {
          _id: '$category',
          product: { $first: '$$ROOT' }
        }
      },
      { $replaceRoot: { newRoot: '$product' } },
      {
        $project: {
          _id: 1,
          title: 1,
          brand: 1,
          price: 1,
          discountPercentage: 1,
          stock: 1,
          rating: 1,
          thumbnail: 1,
          category: 1
        }
      }
    ]);

    res.status(200).json(specialProducts);
  } catch (error) {
    console.error('Error fetching special products:', error);
    res.status(500).json({ error: 'Failed to fetch special products' });
  }
};

const getTopRatedByCategory = async (req, res) => {
  try {
    const categories = await Product.distinct('category');

    const popularProducts = await Promise.all(categories.map(async (category) => {
      const topProduct = await Product.findOne({ category })
        .sort({ rating: -1 })
        .limit(1);
      return topProduct;
    }));

    const filteredProducts = popularProducts.filter(Boolean).slice(0, 4);
    res.status(200).json(filteredProducts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find(); // get all products from DB
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
}; 



module.exports = {
    getCategoriesWithInfo,
    getFeaturedProducts,
    getSingleProduct,
    getFamousProducts,
    getSpecialProducts,
    getTopRatedByCategory,
    getAllProducts
};
