import React, { useContext, useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import ReactStars from "react-rating-stars-component";
import { toast } from "react-toastify";
import { BsHeart, BsHeartFill, BsCartPlus, BsCartCheck } from "react-icons/bs";
import Meta from "../components/Meta";
import BreadCrumb from "../components/BreadCrumb";
import ProductCard from "../components/ProductCard";
import { AuthContext } from "../context/AuthContext";
import { addToCart } from "../services/cartService";
import API_URL from "../config/app";


const money = (n) => (Number(n) || 0).toFixed(2);

const SingleProduct = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [status, setStatus] = useState("loading"); // loading | ready | notfound | error
  const [reloadKey, setReloadKey] = useState(0);
  const [activeImg, setActiveImg] = useState(0);
  const [related, setRelated] = useState([]);

  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [wishlistAdded, setWishlistAdded] = useState(false);
  const [cartLoading, setCartLoading] = useState(false);
  const [cartAdded, setCartAdded] = useState(false);

  // TODO: set this from your orders API so only real buyers can review
  const canReview = true;
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [reviewError, setReviewError] = useState("");
  const [reviewSending, setReviewSending] = useState(false);
  const [localReviews, setLocalReviews] = useState([]); // reviews added in this session

  /* ---------- load product ---------- */
  useEffect(() => {
    const controller = new AbortController();
    window.scrollTo(0, 0);

    // reset everything that belongs to the previous product
    setStatus("loading");
    setActiveImg(0);
    setCartAdded(false);
    setWishlistAdded(false);
    setShowReviewForm(false);
    setLocalReviews([]);

    axios
      .get(`${API_URL}/api/products/${id}`, { signal: controller.signal })
      .then((res) => {
        setProduct(res.data);
        setStatus(res.data ? "ready" : "notfound");
      })
      .catch((err) => {
        if (axios.isCancel(err)) return;
        console.error("Failed to fetch product:", err);
        setStatus(err.response?.status === 404 ? "notfound" : "error");
      });

    return () => controller.abort();
  }, [id, reloadKey]);

  /* ---------- related products (was: the same product shown again) ---------- */
  useEffect(() => {
    const controller = new AbortController();
    axios
      .get(`${API_URL}/api/products/popular`, { signal: controller.signal })
      .then((res) => {
        const list = Array.isArray(res.data) ? res.data : [];
        setRelated(list.filter((p) => p._id !== id).slice(0, 4));
      })
      .catch((err) => {
        if (!axios.isCancel(err))
          console.error("Failed to fetch popular products:", err);
      });
    return () => controller.abort();
  }, [id]);

  /* ---------- is this product already in the user's wishlist? ---------- */
  const isLoggedIn = Boolean(user);
  useEffect(() => {
    if (!isLoggedIn) return undefined;
    const controller = new AbortController();
    axios
      .get(`${API_URL}/api/wishlist/get-wishlist`, {
        withCredentials: true,
        signal: controller.signal,
      })
      .then((res) => {
        const list = Array.isArray(res.data) ? res.data : [];
        setWishlistAdded(list.some((p) => p._id === id));
      })
      .catch(() => {}); // not critical: the heart just starts empty
    return () => controller.abort();
  }, [isLoggedIn, id]);

  /* ---------- derived ---------- */
  const images = useMemo(() => {
    if (!product) return [];
    const list = Array.isArray(product.images)
      ? product.images.filter(Boolean)
      : [];
    if (list.length) return list;
    return product.thumbnail ? [product.thumbnail] : [];
  }, [product]);

  const reviews = useMemo(() => {
    const fromApi = Array.isArray(product?.reviews) ? product.reviews : [];
    return [...localReviews, ...fromApi];
  }, [product, localReviews]);

  const outOfStock =
    product && product.stock !== undefined && Number(product.stock) <= 0;

  /* ---------- actions ---------- */
  const handleAddToCart = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (cartLoading || outOfStock) return;
    setCartLoading(true);
    try {
      await addToCart(id, 1); // quantity = 1
      setCartAdded(true);
      toast.success("Added to cart");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to add to cart");
    } finally {
      setCartLoading(false);
    }
  };

  // one button: adds when empty, removes when filled
  const handleWishlist = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (wishlistLoading) return;
    setWishlistLoading(true);
    try {
      if (wishlistAdded) {
        await axios.delete(`${API_URL}/api/wishlist/remove-wishlist/${id}`, {
          withCredentials: true,
        });
        setWishlistAdded(false);
        toast.success("Removed from wishlist");
      } else {
        await axios.post(
          `${API_URL}/api/wishlist/add-wishlist`,
          { productId: id },
          { withCredentials: true },
        );
        setWishlistAdded(true);
        toast.success("Added to wishlist");
      }
    } catch (err) {
      console.error(err);
      toast.error(
        err.response?.data?.message || "Could not update your wishlist",
      );
    } finally {
      setWishlistLoading(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault(); // the old form had no handler, so Submit reloaded the page
    if (reviewSending) return;
    if (!user) {
      navigate("/login");
      return;
    }
    if (reviewRating < 1) {
      setReviewError("Please choose a star rating.");
      return;
    }
    if (!reviewText.trim()) {
      setReviewError("Please write a short comment.");
      return;
    }
    setReviewError("");
    setReviewSending(true);
    try {
      // TODO: create this endpoint on your backend, or change the URL
      await axios.post(
        `${API_URL}/api/products/${id}/reviews`,
        { rating: reviewRating, comment: reviewText.trim() },
        { withCredentials: true },
      );
      setLocalReviews((prev) => [
        {
          reviewerName: user.name || "You",
          rating: reviewRating,
          comment: reviewText.trim(),
          date: new Date().toISOString(),
        },
        ...prev,
      ]);
      setReviewText("");
      setReviewRating(0);
      setShowReviewForm(false);
      toast.success("Thanks for your review!");
    } catch (err) {
      console.error(err);
      setReviewError(
        err.response?.data?.message ||
          "We could not save your review. Please try again.",
      );
    } finally {
      setReviewSending(false);
    }
  };

  /* ---------- page states ---------- */
  if (status === "loading") {
    return (
      <div className="main-product-wrapper py-5 home-wrapper-2">
        <div className="text-center py-5">
          <div className="spinner-border text-secondary" role="status">
            <span className="visually-hidden">Loading product...</span>
          </div>
        </div>
      </div>
    );
  }

  if (status === "notfound" || status === "error") {
    return (
      <div className="main-product-wrapper py-5 home-wrapper-2">
        <div className="container-xxl text-center py-5">
          <h4>
            {status === "notfound"
              ? "Product not found."
              : "We couldn't load this product."}
          </h4>
          <div className="d-flex justify-content-center gap-2 mt-3 flex-wrap">
            {status === "error" && (
              <button
                type="button"
                className="button border-0"
                onClick={() => setReloadKey((k) => k + 1)}
              >
                Try again
              </button>
            )}
            <Link to="/product" className="button">
              Back to store
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Meta title={product.title} />
      <BreadCrumb title={product.title} />

      {/* ============ MAIN: gallery + details ============ */}
      <div className="main-product-wrapper py-4 py-md-5 home-wrapper-2">
        <div className="container-xxl">
          <div className="row gy-4">
            {/* gallery */}
            <div className="col-12 col-md-6">
              <div className="main-product-image">
                {images[activeImg] && (
                  <img src={images[activeImg]} alt={product.title} />
                )}
              </div>

              {images.length > 1 && (
                <div
                  className="product-thumbs"
                  role="list"
                  aria-label="Product images"
                >
                  {images.map((src, i) => (
                    <button
                      key={`${src}-${i}`}
                      type="button"
                      role="listitem"
                      className={`product-thumb ${i === activeImg ? "active" : ""}`}
                      onClick={() => setActiveImg(i)}
                      aria-label={`Show image ${i + 1} of ${images.length}`}
                      aria-current={i === activeImg}
                    >
                      <img src={src} alt="" loading="lazy" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* details */}
            <div className="col-12 col-md-6">
              <div className="main-product-details">
                <h3 className="title">{product.title}</h3>
                <div className="border-bottom pb-3 mb-3">
                  <p className="price">${money(product.price)}</p>
                  <div className="d-flex align-items-center gap-10 flex-wrap">
                    <ReactStars
                      count={5}
                      size={22}
                      value={Number(product.rating) || 0}
                      edit={false}
                      activeColor="#ffd700"
                    />
                    <a href="#reviews" className="review-btn">
                      ({reviews.length}{" "}
                      {reviews.length === 1 ? "review" : "reviews"})
                    </a>
                  </div>
                </div>

                <div className="border-bottom pb-3 mb-3">
                  {product.brand && (
                    <div className="d-flex gap-10 align-items-center my-2">
                      <h3 className="product-heading">Brand:</h3>
                      <p className="product-data mb-0">{product.brand}</p>
                    </div>
                  )}
                  {product.category && (
                    <div className="d-flex gap-10 align-items-center my-2">
                      <h3 className="product-heading">Category:</h3>
                      <p className="product-data mb-0 text-capitalize">
                        {product.category}
                      </p>
                    </div>
                  )}
                  <div className="d-flex gap-10 align-items-center my-2">
                    <h3 className="product-heading">Availability:</h3>
                    <p
                      className={`product-data mb-0 ${outOfStock ? "text-danger" : "text-success"}`}
                    >
                      {outOfStock ? "Out of stock" : "In stock"}
                    </p>
                  </div>
                </div>

                {/* ---------- action buttons ---------- */}
                <div className="product-actions">
                  {cartAdded ? (
                    <Link to="/cart" className="button product-action-main">
                      <BsCartCheck aria-hidden="true" /> View cart
                    </Link>
                  ) : (
                    <button
                      type="button"
                      className="button border-0 product-action-main"
                      onClick={handleAddToCart}
                      disabled={cartLoading || outOfStock}
                    >
                      <BsCartPlus aria-hidden="true" />{" "}
                      {outOfStock
                        ? "Out of stock"
                        : cartLoading
                          ? "Adding..."
                          : "Add to cart"}
                    </button>
                  )}

                  <button
                    type="button"
                    className={`product-wish-btn ${wishlistAdded ? "active" : ""}`}
                    onClick={handleWishlist}
                    disabled={wishlistLoading}
                    aria-pressed={wishlistAdded}
                  >
                    {wishlistAdded ? (
                      <BsHeartFill aria-hidden="true" />
                    ) : (
                      <BsHeart aria-hidden="true" />
                    )}
                    <span>
                      {wishlistAdded ? "In wishlist" : "Add to wishlist"}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ============ DESCRIPTION ============ */}
      <div className="description-wrapper py-4 py-md-5 home-wrapper-2">
        <div className="container-xxl">
          <h4>Description</h4>
          <div className="bg-white p-3">
            <p className="mb-0">{product.description}</p>
          </div>
        </div>
      </div>

      {/* ============ REVIEWS ============ */}
      <section
        className="reviews-wrapper pb-4 pb-md-5 home-wrapper-2"
        id="reviews"
      >
        <div className="container-xxl">
          <h3>Reviews</h3>
          <div className="review-inner-wrapper">
            <div className="review-head d-flex flex-wrap justify-content-between align-items-end gap-3">
              <div>
                <h4 className="mb-2">Customer Reviews</h4>
                <div className="d-flex align-items-center gap-10 flex-wrap">
                  <ReactStars
                    count={5}
                    size={22}
                    value={Number(product.rating) || 0}
                    edit={false}
                    activeColor="#ffd700"
                  />
                  <p className="mb-0">
                    Based on {reviews.length}{" "}
                    {reviews.length === 1 ? "review" : "reviews"}
                  </p>
                </div>
              </div>
              {canReview && (
                <button
                  type="button"
                  className="btn btn-link text-dark text-decoration-underline p-0"
                  onClick={() => setShowReviewForm((prev) => !prev)}
                  aria-expanded={showReviewForm}
                >
                  {showReviewForm ? "Hide review form" : "Write a review"}
                </button>
              )}
            </div>

            {showReviewForm && (
              <div className="review-form py-4">
                <h4>Write a review</h4>
                <form
                  className="d-flex flex-column gap-15"
                  onSubmit={handleReviewSubmit}
                  noValidate
                >
                  <div>
                    <ReactStars
                      count={5}
                      size={28}
                      value={reviewRating}
                      edit
                      activeColor="#ffd700"
                      onChange={(n) => {
                        setReviewRating(n);
                        setReviewError("");
                      }}
                    />
                  </div>
                  <div>
                    <label htmlFor="review-text" className="visually-hidden">
                      Your comment
                    </label>
                    <textarea
                      id="review-text"
                      className="w-100 form-control"
                      rows={4}
                      placeholder="Comments"
                      value={reviewText}
                      onChange={(e) => {
                        setReviewText(e.target.value);
                        setReviewError("");
                      }}
                    />
                  </div>
                  {reviewError && (
                    <div className="alert alert-danger py-2 mb-0" role="alert">
                      {reviewError}
                    </div>
                  )}
                  <div className="d-flex justify-content-end">
                    <button
                      type="submit"
                      className="button border-0 review-submit"
                      disabled={reviewSending}
                    >
                      {reviewSending ? "Sending..." : "Submit review"}
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="reviews mt-4">
              {reviews.length === 0 ? (
                <p className="mb-0 text-muted">
                  No reviews yet. Be the first to write one.
                </p>
              ) : (
                reviews.map((r, i) => {
                  const name =
                    r.reviewerName || r.user?.name || r.name || "Anonymous";
                  const text = r.comment || r.text || "";
                  const date = r.date ? new Date(r.date) : null;
                  return (
                    <div className="review py-3" key={`${name}-${i}`}>
                      <div className="d-flex flex-wrap gap-10 align-items-center">
                        <h6 className="mb-0">{name}</h6>
                        <ReactStars
                          count={5}
                          size={20}
                          value={Number(r.rating) || 0}
                          edit={false}
                          activeColor="#ffd700"
                        />
                        {date && !Number.isNaN(date.getTime()) && (
                          <small className="text-muted">
                            {date.toLocaleDateString()}
                          </small>
                        )}
                      </div>
                      {text && <p className="mt-2 mb-0">{text}</p>}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ============ MORE PRODUCTS ============ */}
      {related.length > 0 && (
        <section className="popular-wrapper py-4 py-md-5 home-wrapper-2">
          <div className="container-xxl">
            <div className="row">
              <div className="col-12">
                <h3 className="section-heading">Our Popular Products</h3>
              </div>
              {related.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default SingleProduct;
