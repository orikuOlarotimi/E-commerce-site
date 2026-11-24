import React, { useRef, useState } from "react";
import axios from "axios";
import { AiOutlineHome, AiOutlineMail } from "react-icons/ai";
import { BiPhoneCall, BiInfoCircle } from "react-icons/bi";
import Meta from "../components/Meta";
import BreadCrumb from "../components/BreadCrumb";
import API_URL from "../config/app";


const EMAIL = "rotimipraise07@gmail.com";
const PHONE_DISPLAY = "+234 814 039 6486";
const PHONE_LINK = "+2348140396486"; // digits only, no spaces, so tap-to-call works

const INITIAL_FORM = { name: "", email: "", mobile: "", comments: "" };

const validate = ({ name, email, mobile, comments }) => {
  const errs = {};
  if (!name.trim()) errs.name = "Please enter your name";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
    errs.email = "Please enter a valid email address";
  if (mobile.trim() && mobile.replace(/\D/g, "").length < 7)
    errs.mobile = "Please enter a valid phone number";
  if (!comments.trim()) errs.comments = "Please write a message";
  return errs;
};

const Contact = () => {
  const formRef = useRef(null);
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | sending | success | error

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
    if (status === "success" || status === "error") setStatus("idle");
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // the old form had action="" and reloaded the page
    if (status === "sending") return;

    const found = validate(form);
    setErrors(found);
    const firstBad = Object.keys(found)[0];
    if (firstBad) {
      formRef.current?.elements[firstBad]?.focus();
      return;
    }

    setStatus("sending");
    try {
      // TODO: create this endpoint on your backend (see notes), or change the URL
      await axios.post(`${API_URL}/api/contact`, {
        name: form.name.trim(),
        email: form.email.trim(),
        mobile: form.mobile.trim(),
        comments: form.comments.trim(),
      });
      setForm(INITIAL_FORM);
      setStatus("success");
    } catch (err) {
      console.error("Contact form failed:", err);
      setStatus("error");
    }
  };

  const fieldProps = (name) => ({
    id: `contact-${name}`,
    name,
    value: form[name],
    onChange: handleChange,
    "aria-invalid": errors[name] ? "true" : undefined,
    "aria-describedby": errors[name] ? `contact-${name}-error` : undefined,
  });

  const FieldError = ({ name }) =>
    errors[name] ? (
      <div id={`contact-${name}-error`} className="invalid-feedback d-block">
        {errors[name]}
      </div>
    ) : null;

  return (
    <>
      <Meta title="Contact Us" />
      <BreadCrumb title="Contact Us" />

      <div className="contact-wrapper py-4 py-md-5 home-wrapper-2">
        <div className="container-xxl">
          <div className="row">
            {/* ============ MAP ============ */}
            <div className="col-12">
              <div className="contact-map">
                <iframe
                  title="Our location on Google Maps"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d127077.232801687!2d5.690027251707822!3d5.542754903327853!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1041b2ee387d1067%3A0x35957f67d789a763!2sWarri%2C%20Delta!5e0!3m2!1sen!2sng!4v1683963623011!5m2!1sen!2sng"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>

            {/* ============ FORM + DETAILS ============ */}
            <div className="col-12 mt-4 mt-md-5">
              <div className="contact-inner-wrapper">
                <div className="row g-4 g-lg-5">
                  {/* form */}
                  <div className="col-12 col-lg-6">
                    <h3 className="contact-title mb-4">Contact</h3>

                    <form
                      ref={formRef}
                      className="row g-3"
                      onSubmit={handleSubmit}
                      noValidate
                    >
                      <div className="col-12 col-sm-6">
                        <label htmlFor="contact-name" className="contact-label">
                          Name
                        </label>
                        <input
                          type="text"
                          autoComplete="name"
                          className={`form-control ${errors.name ? "is-invalid" : ""}`}
                          placeholder="Your name"
                          {...fieldProps("name")}
                        />
                        <FieldError name="name" />
                      </div>

                      <div className="col-12 col-sm-6">
                        <label
                          htmlFor="contact-email"
                          className="contact-label"
                        >
                          Email
                        </label>
                        <input
                          type="email"
                          autoComplete="email"
                          className={`form-control ${errors.email ? "is-invalid" : ""}`}
                          placeholder="you@example.com"
                          {...fieldProps("email")}
                        />
                        <FieldError name="email" />
                      </div>

                      <div className="col-12">
                        <label
                          htmlFor="contact-mobile"
                          className="contact-label"
                        >
                          Mobile number (optional)
                        </label>
                        <input
                          type="tel"
                          autoComplete="tel"
                          className={`form-control ${errors.mobile ? "is-invalid" : ""}`}
                          placeholder="+234 ..."
                          {...fieldProps("mobile")}
                        />
                        <FieldError name="mobile" />
                      </div>

                      <div className="col-12">
                        <label
                          htmlFor="contact-comments"
                          className="contact-label"
                        >
                          Comments
                        </label>
                        <textarea
                          rows={5}
                          className={`form-control ${errors.comments ? "is-invalid" : ""}`}
                          placeholder="How can we help?"
                          {...fieldProps("comments")}
                        />
                        <FieldError name="comments" />
                      </div>

                      {status === "success" && (
                        <div className="col-12">
                          <div
                            className="alert alert-success mb-0"
                            role="status"
                          >
                            Thanks! Your message has been sent. We&apos;ll get
                            back to you soon.
                          </div>
                        </div>
                      )}
                      {status === "error" && (
                        <div className="col-12">
                          <div className="alert alert-danger mb-0" role="alert">
                            We couldn&apos;t send your message. Please try
                            again, or email us at{" "}
                            <a
                              href={`mailto:${EMAIL}`}
                              className="alert-link d-inline"
                            >
                              {EMAIL}
                            </a>
                            .
                          </div>
                        </div>
                      )}

                      <div className="col-12">
                        <button
                          type="submit"
                          className="button border-0 contact-submit"
                          disabled={status === "sending"}
                        >
                          {status === "sending" ? "Sending..." : "Submit"}
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* details */}
                  <div className="col-12 col-lg-6">
                    <h3 className="contact-title mb-4">Get in touch with us</h3>
                    <ul className="ps-0 mb-0 contact-details">
                      <li>
                        <AiOutlineHome
                          className="fs-5 flex-shrink-0"
                          aria-hidden="true"
                        />
                        <address className="mb-0">
                          Nepa School, Ogoode, Sapele, Delta State, Nigeria
                        </address>
                      </li>
                      <li>
                        <BiPhoneCall
                          className="fs-5 flex-shrink-0"
                          aria-hidden="true"
                        />
                        <a href={`tel:${PHONE_LINK}`}>{PHONE_DISPLAY}</a>
                      </li>
                      <li>
                        <AiOutlineMail
                          className="fs-5 flex-shrink-0"
                          aria-hidden="true"
                        />
                        <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
                      </li>
                      <li>
                        <BiInfoCircle
                          className="fs-5 flex-shrink-0"
                          aria-hidden="true"
                        />
                        <p className="mb-0">Monday - Friday, 10 AM - 8 PM</p>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Contact;
