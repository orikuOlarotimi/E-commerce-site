import React, { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BiArrowBack } from "react-icons/bi";
import Container from "../components/Container";
import axios from "axios";
import { AuthContext } from '../context/AuthContext';

const Checkout = () => {
    const { user } = useContext(AuthContext);
  const [cartItems, setCartItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [shippingData, setShippingData] = useState({
    firstName: "",
    lastName: "",
    address: "",
    apartment: "",
    city: "",
    state: "",
    zip: "",
    country: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user]);
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/cart", {
          withCredentials: true,
        });
        console.log("res", res)
        console.log("res", res.data)
  
        const products = res.data || [];
        setCartItems(products);
  
        const total = products.reduce(
          (acc, item) => acc + item.product.price * item.quantity,
          0
        );
        setSubtotal(total);
      } catch (error) {
        console.error("Failed to fetch cart:", error);
      }
    };
  
    fetchCart();
  }, []);

  const handleInputChange = (e) => {
    setShippingData({ ...shippingData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // prevent page reload
    console.log("handleSubmit called, shippingData:", shippingData);
    console.log(cartItems)
  
    // Optional validation
    const {
      firstName, lastName, address, city, state, zip, country, apartment
    } = shippingData;
  
    if (!firstName || !lastName || !address || !city || !state || !zip || !country || !apartment) {
      alert("Please fill all required fields.");
      return;
    }
  
    // Navigate to payment page and pass shippingData
    navigate("/payment", { state: { shippingData, cartItems, subtotal } });
    console.log("handleSubmit called");
  };

  return (
    <>
       <Container class1="checkout-wrapper py-5 home-wrapper-2">
      <div className="row">
        <div className="col-7">
          <div className="checkout-left-data">
            <h3 className="website-name">Dev Corner</h3>
            <nav style={{ "--bs-breadcrumb-divider": ">" }} aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link className="text-dark total-price" to="/cart">Cart</Link>
                </li>
                &nbsp; /&nbsp;
                <li className="breadcrumb-item total-price active" aria-current="page">
                  Information
                </li>
                &nbsp; /&nbsp;
                <li className="breadcrumb-item total-price active">Shipping</li>
                &nbsp; /&nbsp;
                <li className="breadcrumb-item total-price active" aria-current="page">
                  Payment
                </li>
              </ol>
            </nav>

            <h4 className="title total">Contact Information</h4>
            <p className="user-details total">Your Account Email</p>

            <h4 className="mb-3">Shipping Address</h4>
            <form className="d-flex gap-15 flex-wrap justify-content-between" onSubmit={handleSubmit}>
              <div className="w-100">
                <select
                  name="country"
                  value={shippingData.country}
                  onChange={handleInputChange}
                  className="form-control form-select"
                >
                  <option value="" disabled>Select Country</option>
                  <option value="Nigeria">Nigeria</option>
                  <option value="Ghana">Ghana</option>
                  <option value="USA">USA</option>
                </select>
              </div>
              <div className="flex-grow-1">
                <input
                  type="text"
                  name="firstName"
                  value={shippingData.firstName}
                  onChange={handleInputChange}
                  placeholder="First Name"
                  className="form-control"
                />
              </div>
              <div className="flex-grow-1">
                <input
                  type="text"
                  name="lastName"
                  value={shippingData.lastName}
                  onChange={handleInputChange}
                  placeholder="Last Name"
                  className="form-control"
                />
              </div>
              <div className="w-100">
                <input
                  type="text"
                  name="address"
                  value={shippingData.address}
                  onChange={handleInputChange}
                  placeholder="Address"
                  className="form-control"
                />
              </div>
              <div className="w-100">
                <input
                  type="text"
                  name="apartment"
                  value={shippingData.apartment}
                  onChange={handleInputChange}
                  placeholder="Apartment, Suite, etc."
                  className="form-control"
                />
              </div>
              <div className="flex-grow-1">
                <input
                  type="text"
                  name="city"
                  value={shippingData.city}
                  onChange={handleInputChange}
                  placeholder="City"
                  className="form-control"
                />
              </div>
              <div className="flex-grow-1">
                <select
                  name="state"
                  value={shippingData.state}
                  onChange={handleInputChange}
                  className="form-control form-select"
                >
                  <option value="" disabled>Select State</option>
                  <option value="Lagos">Lagos</option>
                  <option value="Abuja">Abuja</option>
                  <option value="Oyo">Oyo</option>
                </select>
              </div>
              <div className="flex-grow-1">
                <input
                  type="text"
                  name="zip"
                  value={shippingData.zip}
                  onChange={handleInputChange}
                  placeholder="Zipcode"
                  className="form-control"
                />
              </div>
              <div className="w-100">
                <div className="d-flex justify-content-between align-items-center">
                  <Link to="/cart" className="text-dark">
                    <BiArrowBack className="me-2" />
                    Return to Cart
                  </Link>
                    <button type="submit"  className="button">
                      Continue to Shipping
                    </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        <div className="col-5">
          <div className="border-bottom py-4">
            {cartItems.map((item, index) => (
              <div key={item.product._id} className="d-flex gap-10 mb-2 align-align-items-center">
                <div className="w-75 d-flex gap-10">
                  <div className="w-25 position-relative">
                    <span
                      style={{ top: "-10px", right: "2px" }}
                      className="badge bg-secondary text-white rounded-circle p-2 position-absolute"
                    >
                      {item.quantity}
                    </span>
                    <img
                      className="img-fluid"
                      src={item.product.images[0]}
                      alt="product"
                    />
                  </div>
                  <div>
                    <h5 className="total-price">{item.product.title}</h5>
                    <p className="total-price">{item.product.category}</p>
                  </div>
                </div>
                <div className="flex-grow-1">
                  <h5 className="total">${item.product.price * item.quantity}</h5>
                </div>
              </div>
            ))}
          </div>
          <div className="border-bottom py-4">
            <div className="d-flex justify-content-between align-items-center">
              <p className="total">Subtotal</p>
              <p className="total-price">${subtotal}</p>
            </div>
            <div className="d-flex justify-content-between align-items-center">
              <p className="mb-0 total">Shipping</p>
              <p className="mb-0 total-price">$0</p>
            </div>
          </div>
          <div className="d-flex justify-content-between align-items-center py-4">
            <h4 className="total">Total</h4>
            <h5 className="total-price">${subtotal}</h5>
          </div>
        </div>
      </div>
    </Container>

 </>
  );
};

export default Checkout;