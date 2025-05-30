import React, { useState, useEffect, useContext } from "react";
import BreadCrumb from "../components/BreadCrumb";
import Meta from "../components/Meta";
import { AiFillDelete } from "react-icons/ai";
import { Link } from "react-router-dom";
import Container from "../components/Container";
import { AuthContext } from '../context/AuthContext';
import { getCart, removeFromCart, updateCartQuantity } from "../services/cartService";
import {  useNavigate } from "react-router-dom";


const Cart = () => {
  const { user } = useContext(AuthContext);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
      if (!user) {
        navigate("/login");
      }
    }, [user]);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    setLoading(true);
    try {
      const data = await getCart(); // call your service to get cart items
      setCartItems(data); // assuming data is an array of cart items
    } catch (error) {
      console.error("Failed to load cart items:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (productId) => {
    try {
      await removeFromCart(productId);  // your service to remove an item from cart
      setCartItems((prev) => prev.filter((item) => item.product._id !== productId));
    } catch (error) {
      console.error("Failed to remove cart item:", error);
    }
  };

  const handleQuantityChange = async (productId, quantity) => {
    if (quantity < 1) return;
    try {
      await updateCartQuantity(productId, quantity);  // your service for quantity update
      setCartItems((prev) =>
        prev.map((item) =>
          item.product._id === productId ? { ...item, quantity } : item
        )
      );
    } catch (error) {
      console.error("Failed to update quantity:", error);
    }
  };

  const calculateSubtotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  };

  if (loading) return <div>Loading cart...</div>;
  if (cartItems.length === 0)
    return (
      <>
        <Meta title={"Cart"} />
        <BreadCrumb title="Cart" />
        <Container class1="cart-wrapper home-wrapper-2 py-5">
          <h4>Your cart is empty.</h4>
          <Link to="/product" className="button mt-3">
            Continue Shopping
          </Link>
        </Container>
      </>
    );

  return (
    <>
      <Meta title={"Cart"} />
      <BreadCrumb title="Cart" />
      <Container class1="cart-wrapper home-wrapper-2 py-5">
        <div className="row">
          <div className="col-12">
            <div className="cart-header py-3 d-flex justify-content-between align-items-center">
              <h4 className="cart-col-1">Product</h4>
              <h4 className="cart-col-2">Price</h4>
              <h4 className="cart-col-3">Quantity</h4>
              <h4 className="cart-col-4">Total</h4>
            </div>
            {cartItems.map(({ product, quantity }) => (
              <div
                key={product._id}
                className="cart-data py-3 mb-2 d-flex justify-content-between align-items-center"
              >
                <div className="cart-col-1 gap-15 d-flex align-items-center">
                  <div className="w-25">
                    <img
                      src={product.thumbnail}
                      className="img-fluid"
                      alt={product.title}
                    />
                  </div>
                  <div className="w-75">
                    <p>{product.title}</p>
                    {/* Add size/color if available */}
                    {product.size && <p>Size: {product.size}</p>}
                    {product.color && <p>Color: {product.color}</p>}
                  </div>
                </div>
                <div className="cart-col-2">
                  <h5 className="price">${product.price.toFixed(2)}</h5>
                </div>
                <div className="cart-col-3 d-flex align-items-center gap-15">
                  <div>
                    <input
                      className="form-control"
                      type="number"
                      min={1}
                      max={10}
                      value={quantity}
                      onChange={(e) =>
                        handleQuantityChange(product._id, parseInt(e.target.value))
                      }
                    />
                  </div>
                  <div>
                    <AiFillDelete
                      className="text-danger"
                      onClick={() => handleRemove(product._id)}
                      style={{ cursor: "pointer" }}
                    />
                  </div>
                </div>
                <div className="cart-col-4">
                  <h5 className="price">${(product.price * quantity).toFixed(2)}</h5>
                </div>
              </div>
            ))}
          </div>
          <div className="col-12 py-2 mt-4">
            <div className="d-flex justify-content-between align-items-baseline">
              <Link to="/product" className="button">
                Continue To Shopping
              </Link>
              <div className="d-flex flex-column align-items-end">
              <h4>SubTotal: ${calculateSubtotal().toFixed(2)}</h4>
                <p>Taxes and shipping calculated at checkout</p>
                <Link to="/checkout" className="button">
                  Checkout
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
};

export default Cart;