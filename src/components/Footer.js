import React, { useState } from "react";
import { Link } from "react-router-dom";
import { BsLinkedin, BsGithub, BsYoutube, BsInstagram } from "react-icons/bs";

// Keep content in data arrays so the JSX stays short and easy to edit
const INFO_LINKS = [
  { to: "/privacy-policy", label: "Privacy Policy" },
  { to: "/refund-policy", label: "Refund Policy" },
  { to: "/shipping-policy", label: "Shipping Policy" },
  { to: "/term-conditions", label: "Terms & Conditions" },
  { to: "/blogs", label: "Blogs" },
];

// TODO: make sure /about and /faq routes exist in your router
const ACCOUNT_LINKS = [
  { to: "/about", label: "About Us" },
  { to: "/faq", label: "FAQ" },
  { to: "/contact", label: "Contact" },
];

// Uses the search route your Header already handles
const QUICK_LINKS = ["Laptops", "Headphones", "Tablets", "Watch"].map(
  (name) => ({
    to: `/product?search=${encodeURIComponent(name)}`,
    label: name,
  }),
);

// TODO: replace "#" with your real profile URLs
const SOCIALS = [
  { href: "#", label: "LinkedIn", Icon: BsLinkedin },
  { href: "#", label: "Instagram", Icon: BsInstagram },
  { href: "#", label: "GitHub", Icon: BsGithub },
  { href: "#", label: "YouTube", Icon: BsYoutube },
];

const FooterLinks = ({ title, links }) => (
  <>
    <h4 className="footer-heading text-white">{title}</h4>
    <nav className="footer-links d-flex flex-column" aria-label={title}>
      {links.map((l) => (
        <Link key={l.label} to={l.to} className="text-white">
          {l.label}
        </Link>
      ))}
    </nav>
  </>
);

const Footer = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(""); // '', 'success', 'error'

  const handleSubscribe = (e) => {
    e.preventDefault();
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    if (!valid) {
      setStatus("error");
      return;
    }
    // TODO: call your newsletter endpoint here, e.g. axios.post('/api/newsletter', { email })
    setStatus("success");
    setEmail("");
  };

  return (
    <>
      {/* ============ 1. NEWSLETTER ============ */}
      <footer className="py-3">
        <div className="container-xxl">
          <div className="row align-items-center gy-3">
            <div className="col-12 col-md-5">
              <div className="footer-top-data d-flex gap-15 gap-md-30 align-items-center">
                <img
                  src="/images/newsletter.png"
                  alt=""
                  className="footer-newsletter-img"
                />
                <h2 className="footer-newsletter-title mb-0 text-white">
                  Sign up for our newsletter
                </h2>
              </div>
            </div>

            <div className="col-12 col-md-7">
              <form
                className="input-group"
                onSubmit={handleSubscribe}
                noValidate
              >
                <input
                  type="email"
                  className="form-control py-2"
                  placeholder="Your email address"
                  aria-label="Your email address"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (status) setStatus("");
                  }}
                />
                <button
                  type="submit"
                  className="input-group-text footer-subscribe p-2 px-3"
                >
                  Subscribe
                </button>
              </form>
              {status === "success" && (
                <p className="footer-msg text-success mb-0 mt-2" role="status">
                  Thanks for subscribing!
                </p>
              )}
              {status === "error" && (
                <p className="footer-msg text-warning mb-0 mt-2" role="alert">
                  Please enter a valid email address.
                </p>
              )}
            </div>
          </div>
        </div>
      </footer>

      {/* ============ 2. MAIN LINKS ============ */}
      <footer className="py-4">
        <div className="container-xxl">
          <div className="row gy-4">
            <div className="col-12 col-lg-4">
              <h4 className="footer-heading text-white">Contact us</h4>
              <address className="text-white mb-2">
                NEPA Estate, Ogoode, Sapele,
                <br />
                Delta State, Nigeria.
              </address>
              <a href="tel:+918265914234" className="d-block mb-2 text-white">
                +91 8265914234
              </a>
              <a
                href="mailto:rotimipraise07@gmail.com"
                className="d-block mb-3 text-white footer-email"
              >
                rotimipraise07@gmail.com
              </a>
              <div className="social_icons d-flex align-items-center gap-3">
                {SOCIALS.map(({ href, label, Icon }) => (
                  <a
                    key={label}
                    href={href}
                    aria-label={label}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="footer-social"
                  >
                    <Icon className="text-white fs-4" />
                  </a>
                ))}
              </div>
            </div>

            <div className="col-6 col-md-4 col-lg-3">
              <FooterLinks title="Information" links={INFO_LINKS} />
            </div>

            <div className="col-6 col-md-4 col-lg-3">
              <FooterLinks title="Account" links={ACCOUNT_LINKS} />
            </div>

            <div className="col-12 col-md-4 col-lg-2">
              <FooterLinks title="Quick links" links={QUICK_LINKS} />
            </div>
          </div>
        </div>
      </footer>

      {/* ============ 3. COPYRIGHT ============ */}
      <footer className="py-3 py-md-4">
        <div className="container-xxl">
          <p className="text-center mb-0 text-white footer-copy">
            &copy; {new Date().getFullYear()} Powered by Oriku Olarotimi
          </p>
        </div>
      </footer>
    </>
  );
};

export default Footer;
