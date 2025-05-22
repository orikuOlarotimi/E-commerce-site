import React, { useEffect, useState } from 'react';
import ReactStars from "react-rating-stars-component";
import { Link } from 'react-router-dom';

const SpecialProduct = ({ product }) => {
   const { title, brand, price, discountPercentage, stock, rating, thumbnail } = product;

  const discountedPrice = (price - (price * discountPercentage / 100)).toFixed(2);
  const progress = Math.min(100, (stock / 100) * 100); // Assuming 100 is max stock


  const deadline = Date.now() + 5 * 24 * 60 * 60 * 1000;

  const getTimeRemaining = () => {
    const now = Date.now();
    const diff = deadline - now;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / 1000 / 60) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    return { days, hours, minutes, seconds };
  };
  useEffect(() => {
   const timer = setInterval(() => {
     setTimeLeft(getTimeRemaining());
   }, 1000);

   return () => clearInterval(timer);
  }, []);
   
  const [timeLeft, setTimeLeft] = useState(getTimeRemaining());
   

  return (
    <div className='col-6 gap-30 mb-5'>
      <div className='special-product-card'>
        <div className='d-flex justify-content-between'>
          <div>
            <img src={thumbnail} className='img-fluid' alt='product' />
          </div>
          <div className='special-product-content'>
            <h5 className='brand'>{brand}</h5>
            <h6 className='title'>{title}</h6>
            <ReactStars count={5} size={24} value={rating} edit={false} activeColor="#ffd700" />
            <p className='price'>
              <span className='red-p'>${discountedPrice}</span>&nbsp;
              <strike>${price}</strike>
            </p>
            <div className='discount-till d-flex align-items-center gap-10'>
              <p className='mb-0'><b>{timeLeft.days}</b> days</p>
              <div className='d-flex gap-10 align-items-center'>
                <span className='badge rounded-circle p-3 bg-danger'>{timeLeft.hours}</span>:
                <span className='badge rounded-circle p-3 bg-warning'>{timeLeft.minutes}</span>:
                <span className='badge rounded-circle p-3 bg-warning'>{timeLeft.seconds}</span>
              </div>
            </div>
            <div className='prod-count my-3'>
              <p>Products: {stock}</p>
              <div className="progress">
                <div className="progress-bar" role="progressbar" style={{ width: `${progress}%` }}></div>
              </div>
            </div>
            <Link className='button'>Add to cart</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpecialProduct;