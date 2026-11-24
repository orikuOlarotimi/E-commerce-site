import React, { useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import { NavLink, Link, useNavigate, useLocation } from "react-router-dom";
import { BsSearch, BsList, BsX, BsChevronDown } from "react-icons/bs";
import { AuthContext } from "../context/AuthContext";
import API_URL from "../config/app";



const NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/product", label: "Our Store" },
  { to: "/blogs", label: "Blogs" },
  { to: "/contact", label: "Contact" },
];

const Header = () => {
  const { user, logout, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [catOpen, setCatOpen] = useState(false); // desktop dropdown
  const [drawerCatOpen, setDrawerCatOpen] = useState(false); // mobile accordion
  const catRef = useRef(null);

  // TODO: replace with real cart data (e.g. from a CartContext)
  const cartCount = 0;
  const cartTotal = 500;

  /* ---------- data ---------- */
  useEffect(() => {
    const controller = new AbortController();
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/api/products/categories`, {
          signal: controller.signal,
        });
        setCategories(Array.isArray(data) ? data : []);
      } catch (error) {
        if (!axios.isCancel(error))
          console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
    return () => controller.abort();
  }, []);

  /* ---------- close menus on navigation ---------- */
  useEffect(() => {
    setDrawerOpen(false);
    setCatOpen(false);
    setDrawerCatOpen(false);
  }, [location.pathname, location.search]);

  /* ---------- lock page scroll while drawer is open ---------- */
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  /* ---------- Escape closes everything ---------- */
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        setDrawerOpen(false);
        setCatOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  /* ---------- click outside closes desktop dropdown ---------- */
  useEffect(() => {
    if (!catOpen) return;
    const onClick = (e) => {
      if (catRef.current && !catRef.current.contains(e.target))
        setCatOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [catOpen]);

  /* ---------- handlers ---------- */
  const handleSearch = (e) => {
    e.preventDefault();
    const term = searchTerm.trim();
    if (term) {
      navigate(`/product?search=${encodeURIComponent(term)}`);
      setDrawerOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    setDrawerOpen(false);
    navigate("/login");
  };

  const categoryLink = (cat) => `/category/${encodeURIComponent(cat.category)}`;

  /* ---------- reusable account block (desktop + drawer) ---------- */
  const accountLink = user ? (
    <button
      type="button"
      onClick={handleLogout}
      className="header-link-btn d-flex align-items-center gap-10 text-white"
      aria-label="Log out"
    >
      <img src="/images/user.svg" alt="" />
      <p className="mb-0 d-none d-xl-block text-start">
        Logout
        <br />
        My Account
      </p>
    </button>
  ) : (
    <Link
      to="/login"
      className="d-flex align-items-center gap-10 text-white"
      aria-label="Log in"
    >
      <img src="/images/user.svg" alt="" />
      <p className="mb-0 d-none d-xl-block">
        Login
        <br />
        My Account
      </p>
    </Link>
  );

  return (
    <>
      {/* ============ 1. TOP STRIP (tablet and up) ============ */}
      <header className="header-top-strip py-2 d-none d-md-block">
        <div className="container-xxl">
          <div className="row align-items-center">
            <div className="col-md-6 text-start">
              <p className="text-white mb-0 small">
                Free Shipping over $100 &amp; Free Returns
              </p>
            </div>
            <div className="col-md-6 text-end">
              <p className="text-white mb-0 small">
                {!loading && user && (
                  <span className="me-3">Welcome, {user.name}!</span>
                )}
                Hotline:{" "}
                <a className="text-white" href="tel:+918264954234">
                  +91 8264954234
                </a>
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* ============ 2. MAIN BAR ============ */}
      <header className="header-upper py-2">
        <div className="container-xxl">
          <div className="row align-items-center gx-2 gy-2">
            {/* hamburger (mobile + tablet) */}
            <div className="col-auto d-lg-none order-1">
              <button
                type="button"
                className="header-icon-btn"
                onClick={() => setDrawerOpen(true)}
                aria-label="Open menu"
                aria-expanded={drawerOpen}
                aria-controls="mobile-drawer"
              >
                <BsList size={28} />
              </button>
            </div>

            {/* logo */}
            <div className="col col-lg-2 order-2 order-lg-1">
              <h3 className="mb-0 header-logo">
                <Link className="text-white" to="/">
                  Tim Store
                </Link>
              </h3>
            </div>

            {/* search: full-width row on mobile/tablet, centre column on desktop */}
            <div className="col-12 col-lg-5 order-4 order-lg-2">
              <form
                className="input-group"
                onSubmit={handleSearch}
                role="search"
              >
                <input
                  type="search"
                  className="form-control py-2"
                  placeholder="Search product here..."
                  aria-label="Search products"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button
                  className="input-group-text p-2"
                  type="submit"
                  aria-label="Search"
                >
                  <BsSearch className="fs-6" />
                </button>
              </form>
            </div>

            {/* icon links */}
            <div className="col-auto col-lg-5 order-3 order-lg-3">
              <div className="header-upper-links d-flex align-items-center justify-content-end justify-content-xl-between gap-3 gap-xl-2">
                <Link
                  to="/compare-product"
                  className="d-none d-md-flex align-items-center gap-10 text-white"
                  aria-label="Compare products"
                >
                  <img src="/images/compare.svg" alt="" />
                  <p className="mb-0 d-none d-xl-block">
                    compare <br /> products
                  </p>
                </Link>

                <Link
                  to="/wishlist"
                  className="d-none d-md-flex align-items-center gap-10 text-white"
                  aria-label="Wishlist"
                >
                  <img src="/images/wishlist.svg" alt="" />
                  <p className="mb-0 d-none d-xl-block">
                    favourite <br /> wishlist
                  </p>
                </Link>

                <div className="d-none d-md-block">{accountLink}</div>

                <Link
                  to="/cart"
                  className="d-flex align-items-center gap-10 text-white"
                  aria-label="Cart"
                >
                  <span className="cart-icon-wrap">
                    <img src="/images/cart.svg" alt="" />
                    <span className="badge bg-white text-dark cart-badge">
                      {cartCount}
                    </span>
                  </span>
                  <p className="mb-0 d-none d-xl-block">$ {cartTotal}</p>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ============ 3. BOTTOM BAR (desktop only) ============ */}
      <header className="header-bottom py-3 d-none d-lg-block">
        <div className="container-xxl">
          <div className="menu-bottom d-flex align-items-center gap-30">
            <div className="cat-dropdown" ref={catRef}>
              <button
                type="button"
                className="cat-toggle d-flex align-items-center gap-15"
                onClick={() => setCatOpen((o) => !o)}
                aria-expanded={catOpen}
                aria-haspopup="true"
              >
                <img src="/images/menu.svg" alt="" />
                <span className="me-4">Show Categories</span>
                <BsChevronDown
                  className={`cat-chevron ${catOpen ? "open" : ""}`}
                />
              </button>

              {catOpen && (
                <ul className="cat-menu">
                  {categories.length === 0 && (
                    <li className="cat-empty">No categories yet</li>
                  )}
                  {categories.map((cat) => (
                    <li key={cat._id}>
                      <Link className="cat-item" to={categoryLink(cat)}>
                        {cat.category}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <nav className="menu-links" aria-label="Main">
              <div className="d-flex align-items-center gap-15">
                {NAV_LINKS.map((l) => (
                  <NavLink key={l.to} to={l.to}>
                    {l.label}
                  </NavLink>
                ))}
              </div>
            </nav>
          </div>
        </div>
      </header>

      {/* ============ 4. MOBILE / TABLET DRAWER ============ */}
      <div
        className={`drawer-overlay ${drawerOpen ? "show" : ""}`}
        onClick={() => setDrawerOpen(false)}
        aria-hidden="true"
      />
      <aside
        id="mobile-drawer"
        className={`mobile-drawer ${drawerOpen ? "open" : ""}`}
        aria-hidden={!drawerOpen}
        aria-label="Site menu"
      >
        <div className="drawer-head">
          <span className="text-white fw-medium">
            {!loading && user ? `Hi, ${user.name}` : "Menu"}
          </span>
          <button
            type="button"
            className="header-icon-btn"
            onClick={() => setDrawerOpen(false)}
            aria-label="Close menu"
          >
            <BsX size={32} />
          </button>
        </div>

        <nav className="drawer-body" aria-label="Mobile">
          {NAV_LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className="drawer-link"
              end={l.to === "/"}
            >
              {l.label}
            </NavLink>
          ))}

          <button
            type="button"
            className="drawer-link drawer-cat-toggle"
            onClick={() => setDrawerCatOpen((o) => !o)}
            aria-expanded={drawerCatOpen}
          >
            Categories
            <BsChevronDown
              className={`cat-chevron ${drawerCatOpen ? "open" : ""}`}
            />
          </button>
          {drawerCatOpen && (
            <ul className="drawer-cats">
              {categories.map((cat) => (
                <li key={cat._id}>
                  <Link to={categoryLink(cat)} className="drawer-sublink">
                    {cat.category}
                  </Link>
                </li>
              ))}
            </ul>
          )}

          <hr className="drawer-divider" />

          <Link to="/compare-product" className="drawer-link">
            Compare products
          </Link>
          <Link to="/wishlist" className="drawer-link">
            Favourite wishlist
          </Link>
          {user ? (
            <button
              type="button"
              className="drawer-link drawer-btn"
              onClick={handleLogout}
            >
              Logout
            </button>
          ) : (
            <Link to="/login" className="drawer-link">
              Login / My Account
            </Link>
          )}
        </nav>

        <div className="drawer-foot">
          <p className="mb-1">Free Shipping over $100 &amp; Free Returns</p>
          <a href="tel:+918264954234">Hotline: +91 8264954234</a>
        </div>
      </aside>
    </>
  );
};

export default Header;
