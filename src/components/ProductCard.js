import React from 'react'
import ReactStars from "react-rating-stars-component";
import { Link, useLocation } from 'react-router-dom';
const ProductCard = (props) => {
      const {grid} = props;
      let location = useLocation();
     

  return (
    <>
      <div
        className={`${location.pathname == "/store" ? `gr-${grid}` : "col-3"}`}
      >
        <Link to="/product/:id" className="product-card position-relative">
          <div className="wishlist-icon  position-absolute">
            <Link>
              {" "}
              <img src="images/wish.svg" alt="wishlist"></img>
            </Link>
          </div>
          <div className="product-image">
            <img src="/images/watch.jpg" alt="product image"></img>
          </div>
          <div className="product-details">
            <h6 className="brand"> Havels</h6>
            <h5 className="product-title">
              {" "}
              Kids headphone bulk 10 pack multi colored for students
            </h5>
            <ReactStars
              count={5}
              size={24}
              value={4}
              edit={false}
              activeColor="#ffd700"
            />
            ,
            <p className={`description ${grid === 12 ? "d-block" : "d-none"}`}>
              {" "}
              The first line contains a multiple assignment: the variables a and
              b simultaneously get the new values 0 and 1. On the last line this
              is used again, demonstrating that the expressions on the
              right-hand side are all evaluated first before any of the
              assignments take place. The right-hand side expressions are
              evaluated from the left to the right
            </p>
            <p className="price">$100.00</p>
          </div>
          <div className="action-bar position-absolute">
            <div className="d-flex flex-column gap-15">
              <Link>
                {" "}
                <img src="images/prodcompare.svg" alt="compare"></img>
              </Link>
              <Link>
                {" "}
                <img src="images/view.svg" alt="view"></img>
              </Link>
              <Link>
                {" "}
                <img src="images/add-cart.svg" alt="addcart"></img>
              </Link>
            </div>
          </div>
        </Link>
      </div>
      <div
        className={`${location.pathname == "/store" ? `gr-${grid}` : "col-3"}`}
      >
        <Link className="product-card position-relative">
          <div className="wishlist-icon  position-absolute">
            <Link>
              {" "}
              <img src="images/wish.svg" alt="wishlist"></img>
            </Link>
          </div>
          <div className="product-image">
            <img src="/images/watch.jpg" alt="product image"></img>
          </div>
          <div className="product-details">
            <h6 className="brand"> Havels</h6>
            <h5 className="product-title">
              {" "}
              Kids headphone bulk 10 pack multi colored for students
            </h5>
            <ReactStars
              count={5}
              size={24}
              value={4}
              edit={false}
              activeColor="#ffd700"
            />
            ,
            <p className={`description ${grid === 12 ? "d-block" : "d-none"}`}>
              {" "}
              The first line contains a multiple assignment: the variables a and
              b simultaneously get the new values 0 and 1. On the last line this
              is used again, demonstrating that the expressions on the
              right-hand side are all evaluated first before any of the
              assignments take place. The right-hand side expressions are
              evaluated from the left to the right
            </p>
            <p className="price">$100.00</p>
          </div>
          <div className="action-bar position-absolute">
            <div className="d-flex flex-column gap-15">
              <Link>
                {" "}
                <img src="images/prodcompare.svg" alt="compare"></img>
              </Link>
              <Link>
                {" "}
                <img src="images/view.svg" alt="view"></img>
              </Link>
              <Link>
                {" "}
                <img src="images/add-cart.svg" alt="addcart"></img>
              </Link>
            </div>
          </div>
        </Link>
      </div>
    </>
  );
}

export default ProductCard
