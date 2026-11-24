import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Container from "../components/Container";
import { AuthContext } from "../context/AuthContext";
import { removeFromCart } from "../services/cartService";
import API_URL from "../config/app";

const REDIRECT_AFTER_MS = 4000;

const money = (n) => (Number(n) || 0).toFixed(2);

/* ---------- tiny input helpers ---------- */
const formatCard = (v) =>
  v
    .replace(/\D/g, "")
    .slice(0, 19)
    .replace(/(.{4})/g, "$1 ")
    .trim();

const formatExpiry = (v) => {
  const d = v.replace(/\D/g, "").slice(0, 4);
  return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
};

const validateCard = ({ number, expiry, cvv }) => {
  const errs = {};
  const digits = number.replace(/\s/g, "");
  if (digits.length < 13 || digits.length > 19)
    errs.number = "Enter a valid card number";

  const m = /^(\d{2})\/(\d{2})$/.exec(expiry);
  if (!m || Number(m[1]) < 1 || Number(m[1]) > 12) {
    errs.expiry = "Use the format MM/YY";
  } else {
    const now = new Date();
    const thisMonth = (now.getFullYear() % 100) * 12 + now.getMonth() + 1;
    if (Number(m[2]) * 12 + Number(m[1]) < thisMonth)
      errs.expiry = "This card has expired";
  }

  if (!/^\d{3,4}$/.test(cvv)) errs.cvv = "Enter the 3 or 4 digit code";
  return errs;
};

const Payment = () => {
  const { user, loading: authLoading } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const formRef = useRef(null);

  const { shippingData, cartItems } = location.state || {};
  const items = useMemo(
    () => (cartItems || []).filter((i) => i && i.product),
    [cartItems],
  );
  const subtotal = useMemo(
    () => items.reduce((t, i) => t + Number(i.product.price) * i.quantity, 0),
    [items],
  );

  const [card, setCard] = useState({ number: "", expiry: "", cvv: "" });
  const [errors, setErrors] = useState({});
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  /* ---------- guards ---------- */
  useEffect(() => {
    if (!authLoading && !user) navigate("/login");
  }, [authLoading, user, navigate]);

  useEffect(() => {
    if (!success && (!shippingData || items.length === 0)) {
      navigate("/checkout", { replace: true });
    }
  }, [shippingData, items.length, success, navigate]);

  /* ---------- redirect home after success (and clean up if user leaves) ---------- */
  useEffect(() => {
    if (!success) return undefined;
    const timer = setTimeout(() => navigate("/"), REDIRECT_AFTER_MS);
    return () => clearTimeout(timer);
  }, [success, navigate]);

  /* ---------- form ---------- */
  const handleChange = (e) => {
    const { name, value } = e.target;
    const next =
      name === "number"
        ? formatCard(value)
        : name === "expiry"
          ? formatExpiry(value)
          : value.replace(/\D/g, "").slice(0, 4);
    setCard((prev) => ({ ...prev, [name]: next }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    if (processing) return;
    setSubmitError("");

    const found = validateCard(card);
    setErrors(found);
    const firstBad = Object.keys(found)[0];
    if (firstBad) {
      formRef.current?.elements[firstBad]?.focus();
      return;
    }

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
          zipcode: shippingData.zip, // Checkout saves this as `zip` (it was `zipcode`, so it was always undefined)
        },
        products: items.map((item) => ({
          product: item.product._id,
          quantity: item.quantity,
        })),
        totalAmount: subtotal,
        shippingFee: 0,
        paymentStatus: "paid",
        paidAt: new Date(),
      };

      await axios.post(`${API_URL}/api/orders`, orderData, {
        withCredentials: true,
      });

      // The order is already placed, so a failed cart cleanup must not show an error
      await Promise.allSettled(
        items.map((item) => removeFromCart(item.product._id)),
      );

      setSuccess(true);
    } catch (error) {
      console.error("Error placing order:", error);
      setSubmitError(
        "We could not place your order. Please check your connection and try again.",
      );
      setProcessing(false);
    }
  };

  /* ---------- states ---------- */
  if (authLoading) {
    return (
      <Container class1="payment-wrapper py-4 py-md-5 home-wrapper-2">
        <div className="text-center py-5">
          <div className="spinner-border text-secondary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </Container>
    );
  }

  if (success) {
    return (
      <Container class1="payment-wrapper py-4 py-md-5 home-wrapper-2">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-6">
            <div className="payment-card text-center py-5" role="status">
              <div className="payment-success-icon" aria-hidden="true">
                ✓
              </div>
              <h3 className="mb-2">Payment successful!</h3>
              <p className="mb-4 text-muted">
                Thank you for your order. Taking you back to the homepage...
              </p>
              <Link to="/" className="button">
                Go to homepage now
              </Link>
            </div>
          </div>
        </div>
      </Container>
    );
  }

  if (!shippingData || items.length === 0) return null; // redirecting to /checkout

  return (
    <Container class1="payment-wrapper py-4 py-md-5 home-wrapper-2">
      <div className="row gy-4 gx-lg-5">
        {/* ============ PAYMENT FORM ============ */}
        <div className="col-12 col-lg-7">
          <div className="payment-card">
            <h3 className="mb-3">Payment Details</h3>

            <div className="alert alert-warning py-2 small" role="note">
              Demo payment: no real charge is made. Please don&apos;t enter real
              card details.
            </div>

            <p className="payment-ship mb-4">
              <span className="d-block text-muted small">Shipping to</span>
              {shippingData.firstName} {shippingData.lastName},{" "}
              {shippingData.address}
              {shippingData.apartment
                ? `, ${shippingData.apartment}`
                : ""}, {shippingData.city}, {shippingData.state},{" "}
              {shippingData.country}{" "}
              <Link to="/checkout" className="payment-change">
                Change
              </Link>
            </p>

            <form
              ref={formRef}
              className="row g-3"
              onSubmit={handlePayment}
              noValidate
            >
              <div className="col-12">
                <label htmlFor="pay-number" className="checkout-label">
                  Card number
                </label>
                <input
                  id="pay-number"
                  name="number"
                  type="text"
                  inputMode="numeric"
                  autoComplete="cc-number"
                  className={`form-control ${errors.number ? "is-invalid" : ""}`}
                  placeholder="1234 5678 9012 3456"
                  value={card.number}
                  onChange={handleChange}
                  aria-invalid={errors.number ? "true" : undefined}
                />
                {errors.number && (
                  <div className="invalid-feedback d-block">
                    {errors.number}
                  </div>
                )}
              </div>

              <div className="col-6">
                <label htmlFor="pay-expiry" className="checkout-label">
                  Expiry date
                </label>
                <input
                  id="pay-expiry"
                  name="expiry"
                  type="text"
                  inputMode="numeric"
                  autoComplete="cc-exp"
                  className={`form-control ${errors.expiry ? "is-invalid" : ""}`}
                  placeholder="MM/YY"
                  value={card.expiry}
                  onChange={handleChange}
                  aria-invalid={errors.expiry ? "true" : undefined}
                />
                {errors.expiry && (
                  <div className="invalid-feedback d-block">
                    {errors.expiry}
                  </div>
                )}
              </div>

              <div className="col-6">
                <label htmlFor="pay-cvv" className="checkout-label">
                  CVV
                </label>
                <input
                  id="pay-cvv"
                  name="cvv"
                  type="password"
                  inputMode="numeric"
                  autoComplete="cc-csc"
                  className={`form-control ${errors.cvv ? "is-invalid" : ""}`}
                  placeholder="123"
                  value={card.cvv}
                  onChange={handleChange}
                  aria-invalid={errors.cvv ? "true" : undefined}
                />
                {errors.cvv && (
                  <div className="invalid-feedback d-block">{errors.cvv}</div>
                )}
              </div>

              {submitError && (
                <div className="col-12">
                  <div className="alert alert-danger mb-0" role="alert">
                    {submitError}
                  </div>
                </div>
              )}

              <div className="col-12">
                <button
                  type="submit"
                  className="button border-0 w-100"
                  disabled={processing}
                >
                  {processing ? "Processing..." : `Pay $${money(subtotal)}`}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* ============ ORDER SUMMARY ============ */}
        <div className="col-12 col-lg-5">
          <div className="payment-card payment-summary">
            <h4 className="mb-3">Order Summary</h4>

            {items.map(({ product, quantity }) => (
              <div
                key={product._id}
                className="d-flex align-items-center gap-3 border-bottom py-3"
              >
                <img
                  className="order-thumb flex-shrink-0"
                  src={product.images?.[0] || product.thumbnail}
                  alt={product.title}
                  loading="lazy"
                />
                <div className="flex-grow-1 min-w-0">
                  <h6 className="order-title mb-1">{product.title}</h6>
                  <small className="text-muted">Qty: {quantity}</small>
                </div>
                <span className="flex-shrink-0">
                  ${money(product.price * quantity)}
                </span>
              </div>
            ))}

            <div className="d-flex justify-content-between mt-3">
              <span>Shipping</span>
              <span>$0.00</span>
            </div>
            <div className="d-flex justify-content-between mt-2">
              <strong>Total</strong>
              <strong>${money(subtotal)}</strong>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default Payment;
