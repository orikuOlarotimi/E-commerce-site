import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import { BsEye, BsEyeSlash } from "react-icons/bs";
import Meta from "../components/Meta";
import BreadCrumb from "../components/BreadCrumb";
import { AuthContext } from "../context/AuthContext";
import API_URL from "../config/app";


const Login = () => {
  const { user, setUser, loading: authLoading } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const formRef = useRef(null);

  // if a protected page sent the user here, go back to it afterwards
  const redirectTo = location.state?.from?.pathname || "/";

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // already logged in? no need to see the login form
  useEffect(() => {
    if (!authLoading && user) navigate(redirectTo, { replace: true });
  }, [authLoading, user, navigate, redirectTo]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
    if (formError) setFormError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    const email = formData.email.trim();
    const { password } = formData;

    const found = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      found.email = "Please enter a valid email address";
    if (!password) found.password = "Please enter your password";
    setErrors(found);
    const firstBad = Object.keys(found)[0];
    if (firstBad) {
      formRef.current?.elements[firstBad]?.focus();
      return;
    }

    setLoading(true);
    setFormError("");
    try {
      const res = await axios.post(
        `${API_URL}/api/users/login`,
        { email, password },
        { withCredentials: true },
      );

      if (res.data.success) {
        setUser(res.data.user);
        toast.success("Login successful");
        navigate(redirectTo, { replace: true });
      } else {
        setFormError(res.data.message || "Login failed. Please try again.");
      }
    } catch (error) {
      console.error(
        "Login failed:",
        error.response?.data?.message || error.message,
      );
      setFormError(
        error.response?.data?.message || "Invalid email or password",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Meta title="Login" />
      <BreadCrumb title="Login" />

      <div className="container-xxl login-wrapper py-4 py-md-5 home-wrapper-2">
        <div className="row">
          <div className="col-12">
            <div className="auth-card">
              <h3 className="text-center mb-4">Login</h3>

              <form
                ref={formRef}
                onSubmit={handleSubmit}
                className="d-flex flex-column gap-3"
                noValidate
              >
                <div>
                  <label htmlFor="login-email" className="auth-label">
                    Email
                  </label>
                  <input
                    id="login-email"
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    inputMode="email"
                    className={`form-control ${errors.email ? "is-invalid" : ""}`}
                    value={formData.email}
                    onChange={handleChange}
                    aria-invalid={errors.email ? "true" : undefined}
                    aria-describedby={
                      errors.email ? "login-email-error" : undefined
                    }
                  />
                  {errors.email && (
                    <div
                      id="login-email-error"
                      className="invalid-feedback d-block"
                    >
                      {errors.email}
                    </div>
                  )}
                </div>

                <div>
                  <label htmlFor="login-password" className="auth-label">
                    Password
                  </label>
                  <div className="password-field">
                    <input
                      id="login-password"
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Your password"
                      autoComplete="current-password"
                      className={`form-control ${errors.password ? "is-invalid" : ""}`}
                      value={formData.password}
                      onChange={handleChange}
                      aria-invalid={errors.password ? "true" : undefined}
                      aria-describedby={
                        errors.password ? "login-password-error" : undefined
                      }
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowPassword((s) => !s)}
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                      aria-pressed={showPassword}
                    >
                      {showPassword ? <BsEyeSlash /> : <BsEye />}
                    </button>
                  </div>
                  {errors.password && (
                    <div
                      id="login-password-error"
                      className="invalid-feedback d-block"
                    >
                      {errors.password}
                    </div>
                  )}
                </div>

                <div className="text-end">
                  <Link to="/forgot-password" className="auth-forgot">
                    Forgot password?
                  </Link>
                </div>

                {formError && (
                  <div className="alert alert-danger py-2 mb-0" role="alert">
                    {formError}
                  </div>
                )}

                <div className="auth-actions">
                  <button
                    type="submit"
                    className="button border-0"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          aria-hidden="true"
                        />
                        Logging in...
                      </>
                    ) : (
                      "Login"
                    )}
                  </button>
                  <Link to="/signup" className="button signup">
                    Signup
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
