import React from "react";
import ReactStars from "react-rating-stars-component";
import { Link } from "react-router-dom";

// `grid` is the "view" chosen on the store page:
//   3  = 4 per row,  4 = 3 per row,  6 = 2 per row,  12 = list view (1 per row)
// Every value maps to responsive Bootstrap column classes, so nothing
// ever stretches past the screen. (The store sits next to a sidebar, so its
// breakpoints are a step wider than the Home page ones.)
const GRID_CLASSES = {
  12: "col-12",
  6: "col-6",
  4: "col-6 col-md-4",
  3: "col-6 col-md-4 col-xl-3",
};

// Used when no `grid` is passed (Home page: full width, no sidebar)
const DEFAULT_CLASS = "col-6 col-md-4 col-lg-3";

const ProductCard = ({
  product,
  grid,
  onAddToCart,
  onAddToWishlist,
  onCompare,
}) => {
  if (!product) return null;

  const colClass = GRID_CLASSES[grid] || DEFAULT_CLASS;
  const isList = grid === 12;
  const productUrl = `/product/${product._id}`;

  return (
    <div className={colClass}>
      <article
        className={`product-card position-relative ${isList ? "product-card--list" : ""}`}
      >
        {/* Buttons live OUTSIDE the product link: an <a> can't contain another <a> */}
        <button
          type="button"
          className="wishlist-icon position-absolute icon-btn"
          aria-label={`Add ${product.title} to wishlist`}
          onClick={() => onAddToWishlist?.(product)}
        >
          <img src="/images/wish.svg" alt="" />
        </button>

        <Link to={productUrl} className="product-link">
          <div className="product-image">
            <img src={product.thumbnail} alt={product.title} loading="lazy" />
          </div>

          <div className="product-details">
            <h6 className="brand">{product.brand}</h6>
            <h5 className="product-title">{product.title}</h5>
            <ReactStars
              count={5}
              size={18}
              value={Number(product.rating) || 0}
              edit={false}
              activeColor="#ffd700"
            />
            <p className="description">{product.description}</p>
            <p className="price">${product.price}</p>
          </div>
        </Link>

        <div className="action-bar position-absolute">
          <div className="d-flex flex-column gap-15">
            <button
              type="button"
              className="icon-btn"
              aria-label="Compare"
              onClick={() => onCompare?.(product)}
            >
              <img src="/images/prodcompare.svg" alt="" />
            </button>
            <Link
              to={productUrl}
              className="icon-btn"
              aria-label={`View ${product.title}`}
            >
              <img src="/images/view.svg" alt="" />
            </Link>
            <button
              type="button"
              className="icon-btn"
              aria-label={`Add ${product.title} to cart`}
              onClick={() => onAddToCart?.(product)}
            >
              <img src="/images/add-cart.svg" alt="" />
            </button>
          </div>
        </div>
      </article>
    </div>
  );
};

export default ProductCard;
