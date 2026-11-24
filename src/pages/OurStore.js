import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Link, useLocation, useParams } from "react-router-dom";
import { BsChevronDown } from "react-icons/bs";
import BreadCrumb from "../components/BreadCrumb";
import Meta from "../components/Meta";
import ProductCard from "../components/ProductCard";
import API_URL from "../config/app";

// Move this to an env variable / shared config file before deploying
const PAGE_SIZE = 12; // products shown at a time ("Load more" adds another page)

const SORTERS = {
  "title-ascending": (a, b) => (a.title || "").localeCompare(b.title || ""),
  "title-descending": (a, b) => (b.title || "").localeCompare(a.title || ""),
  "price-ascending": (a, b) => Number(a.price) - Number(b.price),
  "price-descending": (a, b) => Number(b.price) - Number(a.price),
};

// value = the `grid` prop ProductCard understands.
// `show` hides options that make no sense at a given screen width.
const GRID_OPTIONS = [
  {
    value: 3,
    icon: "/images/gr4.svg",
    label: "4 per row",
    show: "d-none d-xl-block",
  },
  {
    value: 4,
    icon: "/images/gr3.svg",
    label: "3 per row",
    show: "d-none d-md-block",
  },
  { value: 6, icon: "/images/gr2.svg", label: "2 per row", show: "" },
  { value: 12, icon: "/images/gr.svg", label: "List view", show: "" },
];

const OurStore = () => {
  const { categoryName } = useParams();
  const location = useLocation();

  const [grid, setGrid] = useState(3);
  const [sortOption, setSortOption] = useState("title-ascending");
  const [filtersOpen, setFiltersOpen] = useState(false); // mobile category list
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const rawQuery =
    new URLSearchParams(location.search).get("search")?.trim() || "";
  const query = rawQuery.toLowerCase();

  /* ---------- data ---------- */
  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    axios
      .get(`${API_URL}/api/products/all`, { signal })
      .then((res) => setProducts(Array.isArray(res.data) ? res.data : []))
      .catch((err) => {
        if (axios.isCancel(err)) return;
        console.error("Failed to fetch products", err);
        setError(true);
      })
      .finally(() => {
        if (!signal.aborted) setLoading(false);
      });

    axios
      .get(`${API_URL}/api/products/categories`, { signal })
      .then((res) => setCategories(Array.isArray(res.data) ? res.data : []))
      .catch((err) => {
        if (!axios.isCancel(err))
          console.error("Error fetching categories:", err);
      });

    return () => controller.abort();
  }, []);

  /* ---------- filter + sort (only recomputed when inputs change) ---------- */
  const sortedProducts = useMemo(() => {
    const filtered = products.filter((p) => {
      const category = (p.category || "").toLowerCase();
      const title = (p.title || "").toLowerCase();
      const matchesCategory = categoryName
        ? category === categoryName.toLowerCase()
        : true;
      const matchesSearch = query
        ? title.includes(query) || category.includes(query)
        : true;
      return matchesCategory && matchesSearch;
    });
    return filtered.sort(SORTERS[sortOption] || (() => 0));
  }, [products, categoryName, query, sortOption]);

  /* ---------- reset paging / close mobile filters when the view changes ---------- */
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [categoryName, query, sortOption]);

  useEffect(() => {
    setFiltersOpen(false);
  }, [location.pathname, location.search]);

  const shown = sortedProducts.slice(0, visibleCount);
  const total = sortedProducts.length;

  const emptyMessage = rawQuery
    ? `No products found for "${rawQuery}".`
    : categoryName
      ? `No products in ${categoryName} yet.`
      : "No products available.";

  const pageTitle = categoryName || "Our Store";

  return (
    <>
      <Meta title={pageTitle} />
      <BreadCrumb title={pageTitle} />

      <div className="store-wrapper home-wrapper-2 py-4 py-md-5">
        <div className="container-xxl">
          <div className="row">
            {/* ============ SIDEBAR / MOBILE FILTER ============ */}
            <div className="col-12 col-lg-3">
              <div className="filter-card filter-sticky mb-3">
                {/* phones + tablets: tap to expand */}
                <button
                  type="button"
                  className="filter-toggle d-lg-none"
                  onClick={() => setFiltersOpen((o) => !o)}
                  aria-expanded={filtersOpen}
                  aria-controls="store-categories"
                >
                  <span className="filter-title mb-0">Shop by categories</span>
                  <BsChevronDown
                    className={`filter-chevron ${filtersOpen ? "open" : ""}`}
                  />
                </button>

                {/* laptops: always visible */}
                <h3 className="filter-title d-none d-lg-block">
                  Shop by categories
                </h3>

                <ul
                  id="store-categories"
                  className={`ps-0 mb-0 mt-2 mt-lg-0 ${filtersOpen ? "" : "d-none"} d-lg-block`}
                >
                  <li>
                    <Link
                      to="/product"
                      className={`filter-link ${!categoryName ? "active" : ""}`}
                    >
                      All products
                    </Link>
                  </li>
                  {categories.map((cat) => (
                    <li key={cat._id || cat.category}>
                      <Link
                        to={`/category/${encodeURIComponent(cat.category)}`}
                        className={`filter-link ${
                          categoryName &&
                          categoryName.toLowerCase() ===
                            cat.category.toLowerCase()
                            ? "active"
                            : ""
                        }`}
                      >
                        {cat.category}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* ============ PRODUCTS ============ */}
            <div className="col-12 col-lg-9">
              {/* sort + view bar */}
              <div className="filter-sort-grid mb-3 mb-md-4">
                <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 gap-md-3">
                  <div className="d-flex align-items-center gap-10 sort-box">
                    <label htmlFor="store-sort" className="mb-0 text-nowrap">
                      Sort by:
                    </label>
                    <select
                      id="store-sort"
                      className="form-select"
                      value={sortOption}
                      onChange={(e) => setSortOption(e.target.value)}
                    >
                      <option value="title-ascending">
                        Alphabetically, A-Z
                      </option>
                      <option value="title-descending">
                        Alphabetically, Z-A
                      </option>
                      <option value="price-ascending">
                        Price, low to high
                      </option>
                      <option value="price-descending">
                        Price, high to low
                      </option>
                    </select>
                  </div>

                  <div className="d-flex align-items-center justify-content-between gap-10 view-box">
                    <p className="totalproducts mb-0 text-nowrap">
                      {total} {total === 1 ? "product" : "products"}
                    </p>
                    <div className="d-flex gap-10 align-items-center grid">
                      {GRID_OPTIONS.map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          className={`icon-btn ${opt.show} ${grid === opt.value ? "active" : ""}`}
                          onClick={() => setGrid(opt.value)}
                          aria-label={opt.label}
                          aria-pressed={grid === opt.value}
                        >
                          <img src={opt.icon} alt="" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* product list */}
              <div className="products-list pb-4">
                {loading ? (
                  <div className="text-center py-5">
                    <div
                      className="spinner-border text-secondary"
                      role="status"
                    >
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                ) : error ? (
                  <p className="text-center py-5">
                    We couldn&apos;t load the products. Please refresh and try
                    again.
                  </p>
                ) : total === 0 ? (
                  <p className="text-center py-5">{emptyMessage}</p>
                ) : (
                  <>
                    {/* must be a Bootstrap .row so the col-* classes in ProductCard work */}
                    <div className="row gy-3">
                      {shown.map((product) => (
                        <ProductCard
                          key={product._id}
                          product={product}
                          grid={grid}
                        />
                      ))}
                    </div>

                    {shown.length < total && (
                      <div className="text-center mt-4">
                        <button
                          type="button"
                          className="button border-0"
                          onClick={() => setVisibleCount((n) => n + PAGE_SIZE)}
                        >
                          Load more ({total - shown.length} left)
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OurStore;
