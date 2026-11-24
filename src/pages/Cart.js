import React, { useContext, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AiFillDelete } from "react-icons/ai";
import BreadCrumb from "../components/BreadCrumb";
import Meta from "../components/Meta";
import Container from "../components/Container";
import { AuthContext } from "../context/AuthContext";
import {
  getCart,
  removeFromCart,
  updateCartQuantity,
} from "../services/cartService";

const MAX_QTY = 10;
const money = (n) => (Number(n) || 0).toFixed(2);

const RemoveButton = ({ title, disabled, onClick, className = "" }) => (
  <button
    type="button"
    className={`cart-remove ${className}`}
    onClick={onClick}
    disabled={disabled}
    aria-label={`Remove ${title} from cart`}
  >
    <AiFillDelete />
  </button>
);

const Cart = () => {
  const { user, loading: authLoading } = useContext(AuthContext);
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [busyId, setBusyId] = useState(null); // item currently being updated/removed
  const [reloadKey, setReloadKey] = useState(0);

  const isLoggedIn = Boolean(user);

  /* ---------- redirect only AFTER auth has finished loading ---------- */
  useEffect(() => {
    if (!authLoading && !isLoggedIn) navigate("/login");
  }, [authLoading, isLoggedIn, navigate]);

  /* ---------- load cart once we know who the user is ---------- */
  useEffect(() => {
    if (authLoading || !isLoggedIn) return undefined;
    let cancelled = false;

    (async () => {
      setLoading(true);
      setError(false);
      try {
        const data = await getCart();
        if (!cancelled) setCartItems(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load cart items:", err);
        if (!cancelled) setError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [authLoading, isLoggedIn, reloadKey]);

  // ignore any entry whose product was deleted from the store
  const items = useMemo(
    () => cartItems.filter((i) => i && i.product),
    [cartItems],
  );

  const itemCount = useMemo(
    () => items.reduce((n, i) => n + i.quantity, 0),
    [items],
  );
  const subtotal = useMemo(
    () => items.reduce((t, i) => t + Number(i.product.price) * i.quantity, 0),
    [items],
  );

  /* ---------- actions ---------- */
  const handleRemove = async (productId) => {
    if (busyId) return;
    setBusyId(productId);
    try {
      await removeFromCart(productId);
      setCartItems((prev) => prev.filter((i) => i.product?._id !== productId));
    } catch (err) {
      console.error("Failed to remove cart item:", err);
    } finally {
      setBusyId(null);
    }
  };

  const handleQuantityChange = async (productId, quantity, previous) => {
    if (busyId || quantity < 1 || quantity > MAX_QTY) return;
    setBusyId(productId);
    // update the screen immediately, undo if the server says no
    setCartItems((prev) =>
      prev.map((i) => (i.product?._id === productId ? { ...i, quantity } : i)),
    );
    try {
      await updateCartQuantity(productId, quantity);
    } catch (err) {
      console.error("Failed to update quantity:", err);
      setCartItems((prev) =>
        prev.map((i) =>
          i.product?._id === productId ? { ...i, quantity: previous } : i,
        ),
      );
    } finally {
      setBusyId(null);
    }
  };

  /* ---------- what to show ---------- */
  let content;

  if (authLoading || loading) {
    content = (
      <div className="text-center py-5">
        <div className="spinner-border text-secondary" role="status">
          <span className="visually-hidden">Loading cart...</span>
        </div>
      </div>
    );
  } else if (!isLoggedIn) {
    content = null; // redirecting to /login
  } else if (error) {
    content = (
      <div className="text-center py-5">
        <h4>We couldn&apos;t load your cart.</h4>
        <button
          type="button"
          className="button border-0 mt-3"
          onClick={() => setReloadKey((k) => k + 1)}
        >
          Try again
        </button>
      </div>
    );
  } else if (items.length === 0) {
    content = (
      <div className="text-center py-5">
        <h4>Your cart is empty.</h4>
        <Link to="/product" className="button mt-3">
          Continue Shopping
        </Link>
      </div>
    );
  } else {
    content = (
      <>
        {/* column titles: tablet and up only */}
        <div className="cart-header d-none d-md-block py-3">
          <div className="row">
            <h4 className="col-md-5 mb-0">Product</h4>
            <h4 className="col-md-2 mb-0">Price</h4>
            <h4 className="col-md-3 mb-0">Quantity</h4>
            <h4 className="col-md-2 mb-0">Total</h4>
          </div>
        </div>

        {items.map(({ product, quantity }) => {
          const busy = busyId === product._id;
          return (
            <div
              key={product._id}
              className={`cart-item ${busy ? "is-busy" : ""}`}
            >
              <div className="row align-items-center gy-3">
                {/* product */}
                <div className="col-12 col-md-5">
                  <div className="d-flex align-items-start gap-3">
                    <Link
                      to={`/product/${product._id}`}
                      className="flex-shrink-0"
                    >
                      <img
                        src={product.thumbnail}
                        className="cart-thumb"
                        alt={product.title}
                        loading="lazy"
                      />
                    </Link>
                    <div className="flex-grow-1 min-w-0">
                      <p className="cart-title">{product.title}</p>
                      {product.size && (
                        <p className="cart-meta">Size: {product.size}</p>
                      )}
                      {product.color && (
                        <p className="cart-meta">Color: {product.color}</p>
                      )}
                    </div>
                    {/* phones: delete sits at the top right of the item */}
                    <RemoveButton
                      title={product.title}
                      disabled={busy}
                      onClick={() => handleRemove(product._id)}
                      className="d-md-none"
                    />
                  </div>
                </div>

                {/* price */}
                <div className="col-4 col-md-2">
                  <span className="cart-label d-md-none">Price</span>
                  <h5 className="price mb-0">${money(product.price)}</h5>
                </div>

                {/* quantity */}
                <div className="col-4 col-md-3">
                  <span className="cart-label d-md-none">Quantity</span>
                  <div className="d-flex align-items-center gap-2">
                    <div
                      className="qty"
                      role="group"
                      aria-label={`Quantity for ${product.title}`}
                    >
                      <button
                        type="button"
                        onClick={() =>
                          handleQuantityChange(
                            product._id,
                            quantity - 1,
                            quantity,
                          )
                        }
                        disabled={busy || quantity <= 1}
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>
                      <span className="qty-value" aria-live="polite">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          handleQuantityChange(
                            product._id,
                            quantity + 1,
                            quantity,
                          )
                        }
                        disabled={busy || quantity >= MAX_QTY}
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                    {/* tablet and up: delete sits next to the quantity */}
                    <RemoveButton
                      title={product.title}
                      disabled={busy}
                      onClick={() => handleRemove(product._id)}
                      className="d-none d-md-inline-flex"
                    />
                  </div>
                </div>

                {/* line total */}
                <div className="col-4 col-md-2">
                  <span className="cart-label d-md-none">Total</span>
                  <h5 className="price mb-0">
                    ${money(product.price * quantity)}
                  </h5>
                </div>
              </div>
            </div>
          );
        })}

        {/* summary + actions */}
        <div className="row gy-3 mt-3 mt-md-4 align-items-start">
          <div className="col-12 col-md-6 order-2 order-md-1">
            <Link to="/product" className="button cart-btn">
              Continue Shopping
            </Link>
          </div>
          <div className="col-12 col-md-6 col-lg-5 ms-lg-auto order-1 order-md-2">
            <div className="cart-summary">
              <div className="d-flex justify-content-between align-items-baseline">
                <h4 className="mb-0">
                  Subtotal{" "}
                  <span className="cart-count">
                    ({itemCount} {itemCount === 1 ? "item" : "items"})
                  </span>
                </h4>
                <h4 className="mb-0">${money(subtotal)}</h4>
              </div>
              <p className="mt-2 mb-3">
                Taxes and shipping calculated at checkout
              </p>
              <Link to="/checkout" className="button cart-btn">
                Checkout
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Meta title="Cart" />
      <BreadCrumb title="Cart" />
      <Container class1="cart-wrapper home-wrapper-2 py-4 py-md-5">
        <div className="row">
          <div className="col-12">{content}</div>
        </div>
      </Container>
    </>
  );
};

export default Cart;
