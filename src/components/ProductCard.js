import React from 'react'
import ReactStars from "react-rating-stars-component";
import { Link, useLocation } from 'react-router-dom';


const ProductCard = ({ product, grid }) => {
  if (!product) return null;
     

  return (
    <>
      <div className={grid ? `col-${grid}` : "col-3"}>
        <Link to={`/product/${product._id}`} className= "product-card position-relative col-${grid}">
          <div className="wishlist-icon  position-absolute">
            <Link>
              {" "}
              <img src="images/wish.svg" alt="wishlist"></img>
            </Link>
          </div>
          <div className="product-image">
              <img src={product.thumbnail} alt={product.title} />
          </div>
          <div className="product-details">
          <h6 className="brand">{product.brand}</h6>
          <h5 className="product-title">{product.title}</h5>
             <ReactStars
            count={5}
            size={24}
            value={product.rating}
            edit={false}
            activeColor="#ffd700"
          />
            
            <p className="description d-block">{product.description}</p>
          <p className="price">${product.price}</p>
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
