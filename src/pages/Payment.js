import React, { useEffect, useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Container from "../components/Container";
import axios from "axios";
import { AuthContext } from '../context/AuthContext';
import {removeFromCart } from "../services/cartService";

const Payment = () => {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const { shippingData, cartItems, subtotal} = location.state || {};
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user]);

  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!shippingData || !cartItems || cartItems.length === 0) {
      navigate("/checkout");
    }
  }, [shippingData, cartItems, navigate]);

  const handleFakePayment = async (e) => {
    e.preventDefault();
    setProcessing(true);

    try {
      const orderData = {
        user: user?._id,
        contactEmail: user?.email || "N/A",
        shippingInfo: {
          firstName: shippingData.firstName,
          lastName: shippingData.lastName,
          address: shippingData.address,
          apartment: shippingData.apartment,
          city: shippingData.city,
          state: shippingData.state,
          country: shippingData.country,
          zipcode: shippingData.zipcode,
        },
        products: cartItems.map(item => ({
          product: item.product._id,
          quantity: item.quantity,
        })),
        totalAmount: subtotal,
        shippingFee: 0,
        paymentStatus: "paid",
        paidAt: new Date(),
      };

      // Send order to backend
      await axios.post("http://localhost:5000/api/orders", orderData, { withCredentials: true });

      await Promise.all(
        cartItems.map(item => removeFromCart(item.product._id))
      );

      setSuccess(true);

      // Redirect after 3 seconds
      setTimeout(() => {
        navigate("/");
      }, 3000);
    } catch (error) {
      console.error("Error placing order:", error);
      setProcessing(false);
    }
  };

  return (
    <Container class1="payment-wrapper py-5 home-wrapper-2">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <h3 className="mb-4">Payment Details</h3>
          {success ? (
            <div className="alert alert-success text-center">
              🎉 Payment Successful! Redirecting to homepage...
            </div>
          ) : (
            <>
              {/* Payment Form */}
              <form onSubmit={handleFakePayment}>
                <div className="form-group mb-3">
                  <label>Card Number</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="1234 5678 9012 3456"
                    required
                  />
                </div>
                <div className="form-group mb-3">
                  <label>Expiry Date</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="MM/YY"
                    required
                  />
                </div>
                <div className="form-group mb-3">
                  <label>CVV</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="123"
                    required
                  />
                </div>
                <h5>Total: ${subtotal?.toFixed(2)}</h5>
                <button type="submit" className="button mt-3" disabled={processing}>
                  {processing ? "Processing..." : "Pay Now"}
                </button>
              </form>

              {/* Order Summary */}
              {cartItems && cartItems.length > 0 && (
                  <div className="mt-5">
                    <h4>Order Summary</h4>
                    {cartItems.map((item, index) => (
                      <div key={index} className="d-flex justify-content-between border-bottom py-2">
                        <div>
                          <h6 className="mb-1">{item.product.title}</h6>
                          <small>Qty: {item.quantity}</small>
                        </div>
                        <div>
                          <span>${(item.product.price * item.quantity).toFixed(2)}</span>
                        </div>
                      </div>
                    ))}
                    <div className="d-flex justify-content-between mt-3">
                      <strong>Total:</strong>
                      <strong>${subtotal?.toFixed(2)}</strong>
                    </div>
                  </div>
)}

            </>
          )}
        </div>
      </div>
    </Container>
  );
};

export default Payment;
