import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Meta from '../components/Meta';
import BreadCrumb from '../components/BreadCrumb';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

const Login = () => {
  const { setUser } = useContext(AuthContext);  // <-- use setUser instead of login/logout
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
      e.preventDefault();
      const {email, password} = formData
        setLoading(true);
        try {
            const res = await axios.post(
              'http://localhost:5000/api/users/login',
              { email, password },
              { withCredentials: true }
            );
        
            const user = res.data.user;
        
            if (res.data.success) {
              setUser(user);
              toast.success("Login successful");
              navigate('/');
            }
          } catch (error) {
            console.error('Login failed:', error.response?.data || error.message);
            toast.error(error.response?.data?.message || 'Invalid credentials');
          } finally {
            setLoading(false);
          }
  };

  return (
    <>
      <Meta title={"Login"}></Meta>
      <BreadCrumb title=" Login" />
      <div className='container-xxl login-wrapper py-5 home-wrapper-2'>
        <div className='row'>
          <div className='col-12'>
            <div className='auth-card'>
              <h3 className='text-center mb-3'> Login</h3>
              {loading && (
                <div className="text-center my-3">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              )}
              <form onSubmit={handleSubmit} className='d-flex flex-column gap-30'>
                <div>
                  <input
                    type='email'
                    name='email'
                    placeholder='Email'
                    className='form-control'
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
                <div className='mt-1'>
                  <input
                    type='password'
                    name='password'
                    placeholder='Password'
                    className='form-control'
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <Link to="/forgot-password">Forgot password</Link>
                  <div className='mt-3 d-flex justify-content-center gap-15 align-items-center'>
                    <button type="submit" className='button border-0' disabled={loading}>
                      {loading ? 'Logging in...' : 'Login'}
                    </button>
                    <Link to="/signup" className='button signup'>Signup</Link>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Login;

