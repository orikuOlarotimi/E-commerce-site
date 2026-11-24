import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BiArrowBack } from "react-icons/bi";
import { BsChevronDown } from "react-icons/bs";
import Container from "../components/Container";
import { AuthContext } from "../context/AuthContext";
import { getCart } from "../services/cartService";

const money = (n) => (Number(n) || 0).toFixed(2);

// label shown in error messages; apartment is optional so it is not listed
const REQUIRED_FIELDS = {
  country: "Country",
  firstName: "First name",
  lastName: "Last name",
  address: "Address",
  city: "City",
  state: "State",
  zip: "Postal code",
};

const INITIAL_FORM = {
  firstName: "",
  lastName: "",
  address: "",
  apartment: "",
  city: "",
  state: "",
  zip: "",
  country: "",
};

const STEPS = ["Cart", "Information", "Shipping", "Payment"];

// One labelled input/select with its error message
const Field = ({
  label,
  name,
  value,
  onChange,
  error,
  colClass = "col-12",
  select,
  children,
  ...rest
}) => {
  const id = `co-${name}`;
  const common = {
    id,
    name,
    value,
    onChange,
    "aria-invalid": error ? "true" : undefined,
    "aria-describedby": error ? `${id}-error` : undefined,
    ...rest,
  };
  return (
    <div className={colClass}>
      <label htmlFor={id} className="checkout-label">
        {label}
      </label>
      {select ? (
        <select
          className={`form-select ${error ? "is-invalid" : ""}`}
          {...common}
        >
          {children}
        </select>
      ) : (
        <input
          className={`form-control ${error ? "is-invalid" : ""}`}
          {...common}
        />
      )}
      {error && (
        <div id={`${id}-error`} className="invalid-feedback d-block">
          {error}
        </div>
      )}
    </div>
  );
};

const Checkout = () => {
  const { user, loading: authLoading } = useContext(AuthContext);
  const navigate = useNavigate();
  const formRef = useRef(null);

  const [cartItems, setCartItems] = useState([]);
  const [loadingCart, setLoadingCart] = useState(true);
  const [cartError, setCartError] = useState(false);
  const [shippingData, setShippingData] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [summaryOpen, setSummaryOpen] = useState(false); // phones/tablets only

  const isLoggedIn = Boolean(user);

  /* ---------- redirect only after auth has finished loading ---------- */
  useEffect(() => {
    if (!authLoading && !isLoggedIn) navigate("/login");
  }, [authLoading, isLoggedIn, navigate]);

  /* ---------- load cart ---------- */
  useEffect(() => {
    if (authLoading || !isLoggedIn) return undefined;
    let cancelled = false;

    (async () => {
      setLoadingCart(true);
      setCartError(false);
      try {
        const data = await getCart();
        if (!cancelled) setCartItems(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch cart:", err);
        if (!cancelled) setCartError(true);
      } finally {
        if (!cancelled) setLoadingCart(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [authLoading, isLoggedIn]);

  const items = useMemo(
    () => cartItems.filter((i) => i && i.product),
    [cartItems],
  );
  const subtotal = useMemo(
    () => items.reduce((t, i) => t + Number(i.product.price) * i.quantity, 0),
    [items],
  );

  /* ---------- form ---------- */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined })); // clear as they fix it
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const found = {};
    Object.entries(REQUIRED_FIELDS).forEach(([key, label]) => {
      if (!shippingData[key].trim()) found[key] = `${label} is required`;
    });
    setErrors(found);

    const firstBad = Object.keys(found)[0];
    if (firstBad) {
      formRef.current?.elements[firstBad]?.focus();
      return;
    }

    navigate("/payment", {
      state: {
        shippingData: Object.fromEntries(
          Object.entries(shippingData).map(([k, v]) => [k, v.trim()]),
        ),
        cartItems,
        subtotal,
      },
    });
  };

  /* ---------- order summary (right column on laptops, collapsible on phones) ---------- */
  const summary = (
    <div className="checkout-summary">
      <button
        type="button"
        className="summary-toggle d-lg-none"
        onClick={() => setSummaryOpen((o) => !o)}
        aria-expanded={summaryOpen}
        aria-controls="order-summary"
      >
        <span>
          {summaryOpen ? "Hide" : "Show"} order summary{" "}
          <BsChevronDown
            className={`summary-chevron ${summaryOpen ? "open" : ""}`}
          />
        </span>
        <strong>${money(subtotal)}</strong>
      </button>

      <div
        id="order-summary"
        className={`summary-panel ${summaryOpen ? "" : "d-none"} d-lg-block`}
      >
        <div className="border-bottom py-3 py-lg-4">
          {items.map(({ product, quantity }) => (
            <div
              key={product._id}
              className="d-flex align-items-center gap-3 mb-3"
            >
              <div className="position-relative flex-shrink-0">
                <span className="order-qty badge bg-secondary text-white rounded-circle">
                  {quantity}
                </span>
                <img
                  className="order-thumb"
                  src={product.images?.[0] || product.thumbnail}
                  alt={product.title}
                  loading="lazy"
                />
              </div>
              <div className="flex-grow-1 min-w-0">
                <h5 className="total-price order-title mb-1">
                  {product.title}
                </h5>
                <p className="total-price mb-0 text-capitalize">
                  {product.category}
                </p>
              </div>
              <h5 className="total mb-0 flex-shrink-0">
                ${money(product.price * quantity)}
              </h5>
            </div>
          ))}
        </div>

        <div className="border-bottom py-3 py-lg-4">
          <div className="d-flex justify-content-between align-items-center">
            <p className="total mb-2">Subtotal</p>
            <p className="total-price mb-2">${money(subtotal)}</p>
          </div>
          <div className="d-flex justify-content-between align-items-center">
            <p className="mb-0 total">Shipping</p>
            <p className="mb-0 total-price">$0.00</p>
          </div>
        </div>

        <div className="d-flex justify-content-between align-items-center py-3 py-lg-4">
          <h4 className="total mb-0">Total</h4>
          <h5 className="total-price mb-0">${money(subtotal)}</h5>
        </div>
      </div>
    </div>
  );

  /* ---------- page states ---------- */
  let body;
  if (authLoading || loadingCart) {
    body = (
      <div className="text-center py-5">
        <div className="spinner-border text-secondary" role="status">
          <span className="visually-hidden">Loading checkout...</span>
        </div>
      </div>
    );
  } else if (!isLoggedIn) {
    body = null; // redirecting to /login
  } else if (cartError) {
    body = (
      <div className="text-center py-5">
        <h4>We couldn&apos;t load your order.</h4>
        <Link to="/cart" className="button mt-3">
          Back to cart
        </Link>
      </div>
    );
  } else if (items.length === 0) {
    body = (
      <div className="text-center py-5">
        <h4>Your cart is empty.</h4>
        <Link to="/product" className="button mt-3">
          Continue Shopping
        </Link>
      </div>
    );
  } else {
    body = (
      <div className="row gy-3 gx-lg-5">
        {/* ---------- order summary: on top for phones, right side for laptops ---------- */}
        <div className="col-12 col-lg-5 order-1 order-lg-2">{summary}</div>

        {/* ---------- shipping form ---------- */}
        <div className="col-12 col-lg-7 order-2 order-lg-1">
          <div className="checkout-left-data">
            <h3 className="website-name">
              <Link to="/" className="text-dark">
                Tim Store
              </Link>
            </h3>

            <nav aria-label="Checkout progress">
              <ol className="checkout-steps">
                {STEPS.map((step, i) => (
                  <li
                    key={step}
                    className={i === 1 ? "current" : ""}
                    aria-current={i === 1 ? "step" : undefined}
                  >
                    {i === 0 ? <Link to="/cart">{step}</Link> : step}
                  </li>
                ))}
              </ol>
            </nav>

            <h4 className="title total">Contact Information</h4>
            <p className="user-details total">
              {user?.email || "Your account email"}
            </p>

            <h4 className="mb-3">Shipping Address</h4>
            <form
              ref={formRef}
              className="row g-3"
              onSubmit={handleSubmit}
              noValidate
            >
              <Field
                label="Country"
                name="country"
                select
                value={shippingData.country}
                onChange={handleInputChange}
                error={errors.country}
                autoComplete="country-name"
              >
                <option value="" disabled>
                  Select country
                </option>
                <option value="Nigeria">Nigeria</option>
                <option value="Ghana">Ghana</option>
                <option value="USA">USA</option>
              </Field>

              <Field
                label="First name"
                name="firstName"
                colClass="col-12 col-sm-6"
                value={shippingData.firstName}
                onChange={handleInputChange}
                error={errors.firstName}
                autoComplete="given-name"
              />
              <Field
                label="Last name"
                name="lastName"
                colClass="col-12 col-sm-6"
                value={shippingData.lastName}
                onChange={handleInputChange}
                error={errors.lastName}
                autoComplete="family-name"
              />

              <Field
                label="Address"
                name="address"
                value={shippingData.address}
                onChange={handleInputChange}
                error={errors.address}
                autoComplete="address-line1"
              />
              <Field
                label="Apartment, suite, etc. (optional)"
                name="apartment"
                value={shippingData.apartment}
                onChange={handleInputChange}
                autoComplete="address-line2"
              />

              <Field
                label="City"
                name="city"
                colClass="col-12 col-sm-4"
                value={shippingData.city}
                onChange={handleInputChange}
                error={errors.city}
                autoComplete="address-level2"
              />
              {/* TODO: swap for a <select> of states once you decide which countries you ship to */}
              <Field
                label="State"
                name="state"
                colClass="col-6 col-sm-4"
                value={shippingData.state}
                onChange={handleInputChange}
                error={errors.state}
                autoComplete="address-level1"
              />
              <Field
                label="Postal code"
                name="zip"
                colClass="col-6 col-sm-4"
                value={shippingData.zip}
                onChange={handleInputChange}
                error={errors.zip}
                autoComplete="postal-code"
                inputMode="numeric"
              />

              <div className="col-12">
                <div className="checkout-actions">
                  <Link to="/cart" className="text-dark checkout-back">
                    <BiArrowBack className="me-2" />
                    Return to Cart
                  </Link>
                  <button type="submit" className="button border-0">
                    Continue to Payment
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Container class1="checkout-wrapper py-4 py-md-5 home-wrapper-2">
      {body}
    </Container>
  );
};

export default Checkout;
