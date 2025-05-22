import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { BsSearch } from "react-icons/bs";
import { AuthContext } from '../context/AuthContext';

const Header = () => {
  const { user, logout } = useContext(AuthContext);  // Get user and logout from context
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/products/categories'); // adjust if needed
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const handleSearch = () => {
    if (searchTerm.trim()) {
      navigate(`/product?search=${searchTerm}`);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <>
      <header className="header-top-strip py-3">
        <div className="container-xxl">
          <div className="row align-items-center">
            <div className="col-4 text-start">
              <p className="text-white mb-0">Free Shipping over $100 & Free Returns</p>
            </div>

            <div className="col-4 text-end">
              <p className="text-white mb-0">
                Hotline: <a className="text-white" href="tel:+918264954234">+91 8264954234</a>
              </p>
            </div>

            <div className="col-4 text-center">
              {user ? (
                <p className="text-white mb-0" style={{ textAlign: "end" }}>
                  Welcome, {user.name}!
                </p>
              ) : null}
            </div>
          </div>
        </div>
      </header>

      <header className='header-upper py-2'>
        <div className='container-xxl'>
          <div className='row align-items-center'>
            <div className='col-2'>
              <h3>
                <Link className='text-white' to="/">Dev corner</Link>
              </h3>
            </div>
            <div className='col-5'>
              <div className="input-group">
                <input
                  type="text"
                  className="form-control py-2"
                  placeholder="Search product here..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <button
                  className="input-group-text p-2"
                  id="basic-addon2"
                  onClick={handleSearch}
                >
                  <BsSearch className='fs-6' />
                </button>
              </div>
            </div>
            <div className='col-5'>
              <div className='header-upper-links d-flex align-items-center justify-content-between'>
                <div>
                  <Link to="/compare-product" className='d-flex align-items-center gap-10 text-white'>
                    <img src='/images/compare.svg' alt='compare' />
                    <p className='mb-0'>compare <br /> products</p>
                  </Link>
                </div>
                <div>
                  <Link to="/wishlist" className='d-flex align-items-center gap-10 text-white'>
                    <img src='/images/wishlist.svg' alt='wishlist' />
                    <p className='mb-0'>favourite <br /> wishlist</p>
                  </Link>
                </div>
                <div>
                  {user ? (
                    <div
                      onClick={() => {
                        logout();
                        navigate('/login'); // redirect after logout
                      }}
                      style={{ cursor: 'pointer' }}
                      className='d-flex align-items-center gap-10 text-white'
                    >
                      <img src='/images/user.svg' alt='logout' />
                      <p className='mb-0'>Logout<br />My Account</p>
                    </div>
                  ) : (
                    <Link to="/login" className='d-flex align-items-center gap-10 text-white'>
                      <img src='/images/user.svg' alt='login' />
                      <p className='mb-0'>Login<br />My Account</p>
                    </Link>
                  )}
                </div>
                <div>
                  <Link to="/cart" className='d-flex align-items-center gap-10 text-white'>
                    <img src='/images/cart.svg' alt='cart' />
                    <div className='d-flex flex-column gap-10'>
                      <span className='badge bg-white text-dark'>0</span>
                      <p className='mb-0'>$ 500</p>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <header className='header-bottom py-3'>
        <div className='container-xxl'>
          <div className='row'>
            <div className='col-12'>
              <div className='menu-bottom d-flex align-items-center gap-30'>
                <div>
                  <div className="dropdown">
                    <button
                      className="btn btn-secondary dropdown-toggle bg-transparent border-0 gap-15 d-flex align-items-center"
                      type="button"
                      id="dropdownMenuButton1"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <img src='/images/menu.svg' alt='' />
                      <span className='me-5 d-inline-block'> Show Categories</span>
                    </button>
                    <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                      {categories.map(cat => (
                        <li key={cat._id}>
                          <Link className="dropdown-item text-white" to={`/category/${cat.category}`}>
                            {cat.category}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className='menu-links'>
                  <div className='d-flex align-items-center gap-15'>
                    <NavLink to="/">Home</NavLink>
                    <NavLink to="/product">Our Store</NavLink>
                    <NavLink to="/blogs">Blogs</NavLink>
                    <NavLink to="/contact">Contact</NavLink>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;

