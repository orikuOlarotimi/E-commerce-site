import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate  } from "react-router-dom";
import Meta from "../components/Meta";
import BreadCrumb from "../components/BreadCrumb";
import ProductCard from "../components/ProductCard";
import ReactStars from "react-rating-stars-component";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { addToCart } from "../services/cartService";

const SingleProduct = () => {
  const { id } = useParams(); // Get the product ID from the URL
  const { user } = useContext(AuthContext);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [orderedProduct, setOrderedProduct] = useState(true);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [wishlistAdded, setWishlistAdded] = useState(false);
  const [cartLoading, setCartLoading] = useState(false);
  const [cartAdded, setCartAdded] = useState(false);
  const navigate = useNavigate();


  useEffect(() => {
    console.log("📦 Product ID from params:", id);
  }, [id]);


  const handleAddToWishlist = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      await axios.post(
        'http://localhost:5000/api/wishlist/add-wishlist',
        { productId: id},
        { withCredentials: true }
      );
      alert('Added to wishlist!');
      setWishlistAdded(true);
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || 'Failed to add to wishlist');
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setCartLoading(true);
    try {
      await addToCart(id, 1); // quantity = 1 by default
      alert('Added to cart!');
      setCartAdded(true);
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || 'Failed to add to cart');
    } finally {
      setCartLoading(false);
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/products/${id}`);
        setProduct(response.data);
      } catch (error) {
        console.error("Failed to fetch product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) return <div>Loading product...</div>;
  if (!product) return <div>Product not found.</div>;
  return (
    <>
      <Meta title={product.title}></Meta>
      <BreadCrumb title={product.title} />
      <div className="main-product-wrapper py-5 home-wrapper-2">
        <div className="container-xxl ">
          <div className="row">
            <div className="col-6">
              <div className="main-product-image">
              <img src={product.thumbnail} alt={product.title} className="img-fluid" />
              </div>
            </div>
            <div className="col-6">
            <h3>{product.title}</h3>
              <h5 className="brand">{product.brand}</h5>
              <ReactStars count={5} size={24} value={product.rating} edit={false} activeColor="#ffd700" />
              <p className="price">${product.price}</p>
              <p>{product.description}</p>
              <button  onClick={handleAddToWishlist} disabled={wishlistAdded} >
                🤍 Add to Wishlist
              </button>
              <button onClick={handleAddToCart} disabled={cartLoading || cartAdded} style={{ marginLeft: "10px" }}>
                {cartLoading ? "Adding..." : cartAdded ? "Added to Cart" : "Add to Cart"}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="description-wrapper py-5  home-wrapper-2">
        <div className="container-xxl">
          <div className="row">
            <div className="col-12">
              <h4>Description</h4>
              <div>
                <div className="bg-white p-3">

                <p>{product.description}</p>

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="reviews-wrapper pb-5 home-wrapper-2">
        <div className="container-xxl">
          <div className="row">
            <div className="col-12">
              <h3> Reviews</h3>
              <div className="review-inner-wrapper">
                <div className="review-head d-flex justify-content-between align-items-end">
                  <div>
                    <h4 className="mb-2">Customer Reviews</h4>
                    <div className="d-flex align-items-center gap-10">
                      <ReactStars count={5} size={24} value={product.rating || 0} edit={false} activeColor="#ffd700" />
                      <p className="mb-0"> Based on 2 Reviews</p>
                    </div>
                  </div>
                  {orderedProduct && (
                      <div>
                        <button
                          className="btn btn-link text-dark text-decoration-underline p-0"
                          onClick={() => setShowReviewForm(prev => !prev)}
                        >
                          {showReviewForm ? "Hide Review Form" : "Write A Review"}
                        </button>
                      </div>
                    )}
                </div>

                {showReviewForm && (
                      <div className="review-form py-4">
                        <h4>Write a Review</h4>
                        <form className="d-flex flex-column gap-15">
                          <div>
                            <ReactStars count={5} size={24} value={0} edit={true} activeColor="#ffd700" />
                          </div>
                          <div>
                            <textarea
                              className="w-100 form-control"
                              cols="30"
                              rows="4"
                              placeholder="Comments"
                            ></textarea>
                          </div>
                          <div className="d-flex justify-content-end">
                            <button className="button border-0">Submit Review</button>
                          </div>
                        </form>
                      </div>
                    )}

                <div className="reviews mt-4">
                  <div className="review">
                    <div className="d-flex gap-10 align-items-center">
                      <h6 className="mb-0"> Navdeep</h6>
                      <ReactStars count={5} size={24} value={4} edit={false} activeColor="#ffd700" />
                    </div>
                    <p className="mt-3">
                      ucnjdscnds dhkshdksh ksdhkshdkhskdhs skhdkshdkshd
                      kshdkshdkshdksh kskjd
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="popular-wrapper py-5 home-wrapper-2">
        <div className="container-xxl">
          <div className="row">
            <div className="col-12">
              <h3 className="section-heading">Our Popular Products</h3>
            </div>
            <ProductCard product={product} />
          </div>
        </div>
      </section>
    </>
  );
};

export default SingleProduct;
