import React, { useEffect, useState } from "react";
import ReactStars from "react-rating-stars-component";
import { Link } from "react-router-dom";

const FIVE_DAYS = 5 * 24 * 60 * 60 * 1000;
const pad = (n) => String(n).padStart(2, "0");

const getTimeRemaining = (deadline) => {
  const diff = Math.max(0, deadline - Date.now()); // never negative
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / 1000 / 60) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
};

const SpecialProduct = ({ product }) => {
  const {
    _id,
    title,
    brand,
    price,
    discountPercentage,
    stock,
    rating,
    thumbnail,
    discountEndsAt,
  } = product;

  const discountedPrice = (
    Number(price) *
    (1 - (Number(discountPercentage) || 0) / 100)
  ).toFixed(2);
  const progress = Math.min(100, Math.max(0, Number(stock) || 0)); // assumes 100 = full stock

  // Computed once per card. If your API sends `discountEndsAt`, it is used;
  // otherwise falls back to 5 days from first render (same as before, but stable).
  const [deadline] = useState(() =>
    discountEndsAt
      ? new Date(discountEndsAt).getTime()
      : Date.now() + FIVE_DAYS,
  );
  const [timeLeft, setTimeLeft] = useState(() => getTimeRemaining(deadline));

  useEffect(() => {
    const timer = setInterval(
      () => setTimeLeft(getTimeRemaining(deadline)),
      1000,
    );
    return () => clearInterval(timer);
  }, [deadline]);

  return (
    <div className="col-12 col-xl-6 mb-4">
      <div className="special-product-card h-100">
        <div className="d-flex flex-column flex-sm-row gap-3 align-items-center align-items-sm-start">
          <Link to={`/product/${_id}`} className="special-product-image">
            <img
              src={thumbnail}
              className="img-fluid"
              alt={title}
              loading="lazy"
            />
          </Link>

          <div className="special-product-content">
            <h5 className="brand">{brand}</h5>
            <h6 className="title">{title}</h6>
            <ReactStars
              count={5}
              size={20}
              value={Number(rating) || 0}
              edit={false}
              activeColor="#ffd700"
            />
            <p className="price">
              <span className="red-p">${discountedPrice}</span>&nbsp;
              <s>${price}</s>
            </p>

            <div className="discount-till d-flex align-items-center flex-wrap gap-10">
              <p className="mb-0">
                <b>{timeLeft.days}</b> days
              </p>
              <div
                className="d-flex gap-10 align-items-center"
                aria-label="Time left"
              >
                <span className="timer-badge bg-danger text-white">
                  {pad(timeLeft.hours)}
                </span>
                :
                <span className="timer-badge bg-warning text-dark">
                  {pad(timeLeft.minutes)}
                </span>
                :
                <span className="timer-badge bg-warning text-dark">
                  {pad(timeLeft.seconds)}
                </span>
              </div>
            </div>

            <div className="prod-count my-3">
              <p>Products: {stock}</p>
              <div className="progress">
                <div
                  className="progress-bar"
                  role="progressbar"
                  style={{ width: `${progress}%` }}
                  aria-valuenow={progress}
                  aria-valuemin={0}
                  aria-valuemax={100}
                />
              </div>
            </div>

            {/* TODO: hook up to your cart logic */}
            <button type="button" className="button border-0">
              Add to cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpecialProduct;
