import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Meta from "../components/Meta";
import BreadCrumb from "../components/BreadCrumb";
import { AuthContext } from "../context/AuthContext";
import API_URL from "../config/app";


const Wishlist = () => {
  const { user, loading: authLoading } = useContext(AuthContext);
  const navigate = useNavigate();

  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [removingId, setRemovingId] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  const isLoggedIn = Boolean(user);

  /* ---------- redirect only after auth has finished loading ---------- */
  useEffect(() => {
    if (!authLoading && !isLoggedIn) navigate("/login");
  }, [authLoading, isLoggedIn, navigate]);

  /* ---------- load wishlist ---------- */
  useEffect(() => {
    if (authLoading || !isLoggedIn) return undefined;
    const controller = new AbortController();

    (async () => {
      setLoading(true);
      setError(false);
      try {
        const res = await axios.get(`${API_URL}/api/wishlist/get-wishlist`, {
          withCredentials: true,
          signal: controller.signal,
        });
        setWishlistItems(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        if (axios.isCancel(err)) return;
        console.error("Failed to fetch wishlist:", err);
        setError(true);
        toast.error("Could not load wishlist.");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    })();

    return () => controller.abort();
  }, [authLoading, isLoggedIn, reloadKey]);

  /* ---------- remove ---------- */
  const removeFromWishlist = async (productId) => {
    if (removingId) return; // ignore extra taps while a request is running
    setRemovingId(productId);
    try {
      await axios.delete(
        `${API_URL}/api/wishlist/remove-wishlist/${productId}`,
        {
          withCredentials: true,
        },
      );
      toast.success("Removed from wishlist");
      setWishlistItems((prev) => prev.filter((item) => item._id !== productId));
    } catch (err) {
      console.error("Failed to remove from wishlist:", err);
      toast.error(
        err.response?.data?.message || "Failed to remove from wishlist",
      );
    } finally {
      setRemovingId(null);
    }
  };

  /* ---------- what to show ---------- */
  let content;

  if (authLoading || loading) {
    content = (
      <div className="col-12 text-center py-5">
        <div className="spinner-border text-secondary" role="status">
          <span className="visually-hidden">Loading wishlist...</span>
        </div>
      </div>
    );
  } else if (!isLoggedIn) {
    content = null; // redirecting to /login
  } else if (error) {
    content = (
      <div className="col-12 text-center py-5">
        <h5>We couldn&apos;t load your wishlist.</h5>
        <button
          type="button"
          className="button border-0 mt-3"
          onClick={() => setReloadKey((k) => k + 1)}
        >
          Try again
        </button>
      </div>
    );
  } else if (wishlistItems.length === 0) {
    content = (
      <div className="col-12 text-center py-5">
        <h5>Your wishlist is empty.</h5>
        <Link to="/product" className="button mt-3">
          Browse products
        </Link>
      </div>
    );
  } else {
    content = wishlistItems.map((item) => {
      const productUrl = `/product/${item._id}`;
      const busy = removingId === item._id;
      return (
        <div className="col-6 col-md-4 col-lg-3" key={item._id}>
          <div
            className={`wishlist-card position-relative ${busy ? "is-busy" : ""}`}
          >
            {/* button sits outside the product link so the two never conflict */}
            <button
              type="button"
              className="wishlist-remove"
              onClick={() => removeFromWishlist(item._id)}
              disabled={busy}
              aria-label={`Remove ${item.title} from wishlist`}
            >
              <img src="/images/cross.svg" alt="" />
            </button>

            <Link to={productUrl} className="wishlist-link">
              <div className="wishlist-card-image">
                <img
                  src={item.images?.[0] || item.thumbnail || "/placeholder.png"}
                  alt={item.title}
                  loading="lazy"
                />
              </div>
              <div className="wishlist-card-body">
                <h5 className="title">{item.title}</h5>
                <h6 className="price mb-0">
                  ${(Number(item.price) || 0).toFixed(2)}
                </h6>
              </div>
            </Link>
          </div>
        </div>
      );
    });
  }

  return (
    <>
      <Meta title="Wishlist" />
      <BreadCrumb title="Wishlist" />
      <div className="wishlist-wrapper home-wrapper-2 py-4 py-md-5">
        <div className="container-xxl">
          <div className="row gy-3">{content}</div>
        </div>
      </div>
    </>
  );
};

export default Wishlist;
