import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Container from "../components/Container";
import axios from "axios";

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { shippingData, cartItems, subtotal } = location.state || {};

  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!shippingData || !cartItems) {
      navigate("/checkout");
    }
  }, [shippingData, cartItems, navigate]);

  const handleFakePayment = async (e) => {
    e.preventDefault();
    setProcessing(true);

    try {
      const orderData = {
        shippingInfo: shippingData,
        orderItems: cartItems,
        totalPrice: subtotal,
        status: "Paid",
        paidAt: new Date(),
      };

      // POST to backend
      await axios.post("/api/orders", orderData, { withCredentials: true });

      setSuccess(true);
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
            <form onSubmit={handleFakePayment}>
              <div className="form-group mb-3">
                <label>Card Number</label>
                <input type="text" className="form-control" placeholder="1234 5678 9012 3456" required />
              </div>
              <div className="form-group mb-3">
                <label>Expiry Date</label>
                <input type="text" className="form-control" placeholder="MM/YY" required />
              </div>
              <div className="form-group mb-3">
                <label>CVV</label>
                <input type="text" className="form-control" placeholder="123" required />
              </div>
              <h5>Total: ${subtotal}</h5>
              <button type="submit" className="button mt-3" disabled={processing}>
                {processing ? "Processing..." : "Pay Now"}
              </button>
            </form>
          )}
        </div>
      </div>
      </Container>
  );
};

export default Payment;
