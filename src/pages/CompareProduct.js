import React, { useState } from "react";
import { Link } from "react-router-dom";
import BreadCrumb from "../components/BreadCrumb";
import Meta from "../components/Meta";
import Color from "../components/Color";

// TODO: replace with the products the user chose to compare (a CompareContext or your API).
// The compare icon on ProductCard already accepts an `onCompare` prop for this.
const PLACEHOLDER_ITEMS = [
  {
    id: "c1",
    title: "Honor Ti 7.0 1GB RAM 8GB ROM 7 Inch With WI-Fi + 3G Tablet",
    price: 100,
    image: "/images/watch.jpg",
    brand: "Havels",
    type: "Watch",
    availability: "In Stock",
    sizes: ["S", "M"],
  },
  {
    id: "c2",
    title: "Honor Ti 7.0 1GB RAM 8GB ROM 7 Inch With WI-Fi + 3G Tablet",
    price: 100,
    image: "/images/watch.jpg",
    brand: "Havels",
    type: "Watch",
    availability: "In Stock",
    sizes: ["S", "M"],
  },
];

const money = (n) => (Number(n) || 0).toFixed(2);

const CompareProduct = () => {
  const [items, setItems] = useState(PLACEHOLDER_ITEMS);

  const handleRemove = (id) =>
    setItems((prev) => prev.filter((p) => p.id !== id));

  return (
    <>
      <Meta title="Compare Product" />
      <BreadCrumb title="Compare Product" />

      <div className="compare-product-wrapper py-4 py-md-5 home-wrapper-2">
        <div className="container-xxl">
          {items.length === 0 ? (
            <div className="text-center py-5">
              <h5>You have no products to compare.</h5>
              <Link to="/product" className="button mt-3">
                Browse products
              </Link>
            </div>
          ) : (
            <>
              {items.length > 1 && (
                <p className="compare-hint d-lg-none">
                  Swipe sideways to compare products →
                </p>
              )}

              {/* scrolls sideways on phones and tablets, wraps into a grid on laptops */}
              <div className="compare-grid" role="list">
                {items.map((item) => (
                  <div className="compare-item" key={item.id} role="listitem">
                    <div className="compare-product-card position-relative h-100">
                      <button
                        type="button"
                        className="compare-remove"
                        onClick={() => handleRemove(item.id)}
                        aria-label={`Remove ${item.title} from comparison`}
                      >
                        <img src="/images/cross.svg" alt="" />
                      </button>

                      <div className="product-card-image">
                        <img src={item.image} alt={item.title} loading="lazy" />
                      </div>

                      <div className="compare-product-details">
                        <h5 className="title">{item.title}</h5>
                        <h6 className="price mb-3 mt-3">
                          ${money(item.price)}
                        </h6>

                        <div>
                          <div className="product-detail">
                            <h5>Brand:</h5>
                            <p>{item.brand}</p>
                          </div>
                          <div className="product-detail">
                            <h5>Type:</h5>
                            <p>{item.type}</p>
                          </div>
                          <div className="product-detail">
                            <h5>Availability:</h5>
                            <p>{item.availability}</p>
                          </div>
                          <div className="product-detail">
                            <h5>Color:</h5>
                            <Color />
                          </div>
                          <div className="product-detail">
                            <h5>Size:</h5>
                            <div className="d-flex gap-10">
                              {item.sizes.map((s) => (
                                <p key={s}>{s}</p>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default CompareProduct;
