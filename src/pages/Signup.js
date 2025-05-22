import React, { useState, useContext } from 'react';
import Meta from '../components/Meta';
import BreadCrumb from '../components/BreadCrumb';
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

const Signup = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);  // <-- Get setUser from context
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        'http://localhost:5000/api/users/signup',
        formData,
        { withCredentials: true }
      );
       
        if (response.error) {
            toast.error(response.error)
        }
      const user = response.data.user; // Adjust if your backend returns user differently
      if (user) {
        setUser(user);      // <-- Set user in context
        navigate('/');      // <-- Navigate after signup success
      } else {
        alert('Signup successful! Please login.');
        navigate('/login'); // if no user returned, redirect to login page
      }

      setFormData({
        name: '',
        email: '',
        mobile: '',
        password: ''
      });
    } catch (error) {
      console.error('Signup error:', error.response?.data || error.message);
      alert('Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Meta title={"Sign Up"}></Meta>
      <BreadCrumb title=" Sign Up" />
      <div className="container-xxl login-wrapper py-5 home-wrapper-2">
        <div className="row">
          <div className="col-12">
            <div className="auth-card">
              <h3 className="text-center mb-3">Sign up</h3>
              {loading && (
                <div className="text-center my-3">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              )}
              <form onSubmit={handleSubmit} className="d-flex flex-column gap-30">
                <div>
                  <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    className="form-control"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    className="form-control"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <input
                    type="tel"
                    name="mobile"
                    placeholder="Mobile Number"
                    className="form-control"
                    value={formData.mobile}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mt-1">
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    className="form-control"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <div className="mt-3 d-flex justify-content-center gap-15 align-items-center">
                    <button type="submit" className="button border-0" disabled={loading}>
                      {loading ? 'Signing up...' : 'Sign Up'}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Signup;

