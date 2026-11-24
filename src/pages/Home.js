import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Marquee from "react-fast-marquee";
import BlogCard from "../components/BlogCard";
import ProductCard from "../components/ProductCard";
import SpecialProduct from "../components/SpecialProduct";
import API_URL from "../config/app";

// Move this to an env variable / shared config file before deploying

/* ---------- static content ---------- */
const SMALL_BANNERS = [
  { img: "/images/catbanner-01.jpg", tag: "BEST SALE", title: "iPad S13+ Pro" },
  {
    img: "/images/catbanner-02.jpg",
    tag: "NEW ARRIVAL",
    title: "BUY IPAD AIR",
  },
  {
    img: "/images/catbanner-03.jpg",
    tag: "SUPERCHARGED FOR PROS.",
    title: "iPad S13+ Pro",
  },
  {
    img: "/images/catbanner-04.jpg",
    tag: "SUPERCHARGED FOR PROS.",
    title: "iPad S13+ Pro",
  },
];

const SERVICES = [
  {
    img: "/images/service.png",
    title: "Free Shipping",
    text: "From all orders over $5",
  },
  {
    img: "/images/service-02.png",
    title: "Daily Surprise Offer",
    text: "Save up to 25% off",
  },
  {
    img: "/images/service-03.png",
    title: "Support 24/7",
    text: "Shop with an expert",
  },
  {
    img: "/images/service-04.png",
    title: "Affordable Prices",
    text: "Get factory default price",
  },
  {
    img: "/images/service-05.png",
    title: "Secure Payments",
    text: "100% protected payment",
  },
];

const BRANDS = Array.from(
  { length: 8 },
  (_, i) => `/images/brand-0${i + 1}.png`,
);

// TODO: replace with real posts from your API, then pass each one as <BlogCard post={post} />
const PLACEHOLDER_BLOGS = [1, 2, 3, 4];

/* ---------- helpers ---------- */
// One small hook per list: all requests run in parallel and each section
// appears as soon as its own data arrives.
const useList = (endpoint) => {
  const [state, setState] = useState({ items: [], loading: true });

  useEffect(() => {
    const controller = new AbortController();
    axios
      .get(`${API_URL}/api/products/${endpoint}`, { signal: controller.signal })
      .then((res) => {
        setState({
          items: Array.isArray(res.data) ? res.data : [],
          loading: false,
        });
      })
      .catch((err) => {
        if (axios.isCancel(err)) return;
        console.error(`Error fetching ${endpoint}:`, err);
        setState({ items: [], loading: false });
      });
    return () => controller.abort();
  }, [endpoint]);

  return state;
};

const discounted = (p) =>
  (Number(p.price) * (1 - (Number(p.discountPercentage) || 0) / 100)).toFixed(
    2,
  );

const Spinner = () => (
  <div className="text-center py-4">
    <div className="spinner-border text-secondary" role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
  </div>
);

// Heading + content. Hides itself if the request finished with nothing to show.
const Section = ({ title, className = "", list, children }) => {
  if (!list.loading && list.items.length === 0) return null;
  return (
    <section className={`home-wrapper-2 py-4 py-md-5 ${className}`}>
      <div className="container-xxl">
        <div className="row">
          <div className="col-12">
            <h3 className="section-heading">{title}</h3>
          </div>
          {list.loading ? (
            <div className="col-12">
              <Spinner />
            </div>
          ) : (
            children
          )}
        </div>
      </div>
    </section>
  );
};

/* ---------- page ---------- */
const Home = () => {
  const [welcomeUser, setWelcomeUser] = useState(null);

  const categories = useList("categories");
  const featured = useList("featured");
  const famous = useList("famous");
  const special = useList("special");
  const popular = useList("popular");

  // Welcome toast (was never rendered before, and the timer was ~16 minutes)
  useEffect(() => {
    let stored = null;
    try {
      stored = JSON.parse(localStorage.getItem("customer"));
    } catch {
      stored = null;
    }
    if (!stored) return undefined;

    setWelcomeUser(stored);
    const timer = setTimeout(() => {
      setWelcomeUser(null);
      localStorage.removeItem("customer");
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {welcomeUser && (
        <div className="welcome-message" role="status">
          Welcome{welcomeUser.name ? `, ${welcomeUser.name}` : ""}!
        </div>
      )}

      {/* ============ HERO ============ */}
      <section className="home-wrapper-1 py-4 py-md-5">
        <div className="container-xxl">
          <div className="row gy-3">
            <div className="col-12 col-lg-6">
              <div className="main-banner position-relative p-0 p-md-2">
                <img
                  src="/images/main-banner-1.jpg"
                  className="img-fluid rounded-3"
                  alt=""
                />
                <div className="main-banner-content position-absolute">
                  <h4>SUPERCHARGED FOR PROS.</h4>
                  <h5>iPad S13+ Pro</h5>
                  <p>From $999.00 or $41.62/mo.</p>
                  <Link className="button" to="/product">
                    BUY NOW
                  </Link>
                </div>
              </div>
            </div>

            <div className="col-12 col-lg-6">
              <div className="d-flex flex-wrap gap-10 justify-content-between align-items-center">
                {SMALL_BANNERS.map((b, i) => (
                  <div className="small-banner position-relative" key={i}>
                    <img src={b.img} className="img-fluid rounded-3" alt="" />
                    <div className="small-banner-content position-absolute">
                      <h4>{b.tag}</h4>
                      <h5>{b.title}</h5>
                      <p>
                        From $999.00 <br />
                        or $41.62/mo.
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ SERVICES ============ */}
      <section className="home-wrapper-2 py-4 py-md-5">
        <div className="container-xxl">
          <div className="services row g-3">
            {SERVICES.map((s) => (
              <div className="col-12 col-sm-6 col-md-4 col-xl" key={s.title}>
                <div className="d-flex align-items-center gap-15">
                  <img src={s.img} alt="" loading="lazy" />
                  <div>
                    <h6 className="mb-1">{s.title}</h6>
                    <p className="mb-0">{s.text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ CATEGORIES ============ */}
      {categories.items.length > 0 && (
        <section className="home-wrapper-2 py-4 py-md-5">
          <div className="container-xxl">
            <div className="categories">
              {categories.items.map((cat) => (
                <Link
                  key={cat._id || cat.category}
                  to={`/category/${encodeURIComponent(cat.category)}`}
                  className="category-item"
                >
                  <div>
                    <h6>{cat.category}</h6>
                    <p>{cat.count} Items</p>
                  </div>
                  <img src={cat.image} alt="" loading="lazy" />
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ============ FEATURED ============ */}
      <Section
        title="Featured Collection"
        className="featured-wrapper"
        list={featured}
      >
        {featured.items.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </Section>

      {/* ============ SPECIAL DISCOUNTS ============ */}
      <Section
        title="Special Discounts"
        className="famous-wrapper"
        list={famous}
      >
        {famous.items.map((product) => (
          <div className="col-12 col-md-6 col-lg-4 mb-3" key={product._id}>
            <Link
              to={`/product/${product._id}`}
              className="famous-card d-block h-100"
            >
              <img
                src={product.thumbnail}
                alt={product.title}
                className="img-fluid"
                loading="lazy"
              />
              <div className="famous-content">
                <h5 className="text-dark text-uppercase">{product.category}</h5>
                <h6 className="text-dark">{product.title}</h6>
                <p className="text-dark mb-0">
                  Now from ${discounted(product)}
                </p>
              </div>
            </Link>
          </div>
        ))}
      </Section>

      {/* ============ SPECIAL PRODUCTS ============ */}
      <Section
        title="Special Product"
        className="special-wrapper"
        list={special}
      >
        {special.items.map((product) => (
          <SpecialProduct key={product._id} product={product} />
        ))}
      </Section>

      {/* ============ POPULAR ============ */}
      <Section
        title="Our Popular Products"
        className="popular-wrapper"
        list={popular}
      >
        {popular.items.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </Section>

      {/* ============ BRANDS ============ */}
      <section className="marque-wrapper home-wrapper-2 py-4 py-md-5">
        <div className="container-xxl">
          <div className="maquee-inner-wrapper card-wrapper">
            <Marquee gradient={false} speed={40} pauseOnHover>
              {BRANDS.map((src, i) => (
                <div className="brand-item mx-3 mx-md-4" key={src}>
                  <img
                    src={src}
                    alt={`Brand ${i + 1}`}
                    className="img-fluid"
                    loading="lazy"
                  />
                </div>
              ))}
            </Marquee>
          </div>
        </div>
      </section>

      {/* ============ BLOGS ============ */}
      <section className="blog-wrapper home-wrapper-2 py-4 py-md-5">
        <div className="container-xxl">
          <h3 className="section-heading">Our Latest Blogs</h3>
          <div className="row gy-3">
            {PLACEHOLDER_BLOGS.map((id) => (
              <div className="col-12 col-sm-6 col-lg-3" key={id}>
                <BlogCard />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
