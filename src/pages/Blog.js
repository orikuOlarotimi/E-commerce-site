import React, { useMemo, useState } from "react";
import { BsChevronDown } from "react-icons/bs";
import BreadCrumb from "../components/BreadCrumb";
import Meta from "../components/Meta";
import BlogCard from "../components/BlogCard";

const CATEGORIES = ["Watch", "TV", "Camera", "Laptop"];

// TODO: replace with posts from your API. Each post needs the same fields BlogCard
// reads: _id, image, date, title, excerpt (plus `category` for the filter below).
// Without an _id the "Read more" button falls back to the /blogs list.
const PLACEHOLDER_POSTS = [
  {
    slug: "p1",
    category: "Watch",
    image: "/images/blog-1.jpg",
    date: "5 MAY 2023",
    title: "A BEAUTIFUL SUNDAY MORNING",
    excerpt:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.",
  },
  {
    slug: "p2",
    category: "TV",
    image: "/images/blog-1.jpg",
    date: "12 MAY 2023",
    title: "CHOOSING THE RIGHT TV FOR YOUR ROOM",
    excerpt:
      "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo.",
  },
  {
    slug: "p3",
    category: "Camera",
    image: "/images/blog-1.jpg",
    date: "20 MAY 2023",
    title: "PHOTOGRAPHY TIPS FOR BEGINNERS",
    excerpt:
      "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla.",
  },
  {
    slug: "p4",
    category: "Laptop",
    image: "/images/blog-1.jpg",
    date: "1 JUN 2023",
    title: "WHAT TO LOOK FOR IN A NEW LAPTOP",
    excerpt:
      "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim.",
  },
];

const Blog = () => {
  const [activeCategory, setActiveCategory] = useState(null); // null = all posts
  const [filtersOpen, setFiltersOpen] = useState(false); // phones/tablets only

  const posts = useMemo(
    () =>
      activeCategory
        ? PLACEHOLDER_POSTS.filter((p) => p.category === activeCategory)
        : PLACEHOLDER_POSTS,
    [activeCategory],
  );

  const selectCategory = (cat) => {
    setActiveCategory(cat);
    setFiltersOpen(false);
  };

  return (
    <>
      <Meta title="Blogs" />
      <BreadCrumb title="Blogs" />

      <div className="blog-wrapper home-wrapper-2 py-4 py-md-5">
        <div className="container-xxl">
          <div className="row">
            {/* ============ CATEGORY FILTER ============ */}
            <div className="col-12 col-lg-3">
              <div className="filter-card filter-sticky mb-3">
                {/* phones + tablets: tap to expand */}
                <button
                  type="button"
                  className="filter-toggle d-lg-none"
                  onClick={() => setFiltersOpen((o) => !o)}
                  aria-expanded={filtersOpen}
                  aria-controls="blog-categories"
                >
                  <span className="filter-title mb-0">Find by categories</span>
                  <BsChevronDown
                    className={`filter-chevron ${filtersOpen ? "open" : ""}`}
                  />
                </button>

                {/* laptops: always visible */}
                <h3 className="filter-title d-none d-lg-block">
                  Find by categories
                </h3>

                <ul
                  id="blog-categories"
                  className={`ps-0 mb-0 mt-2 mt-lg-0 ${filtersOpen ? "" : "d-none"} d-lg-block`}
                >
                  <li>
                    <button
                      type="button"
                      className={`filter-link filter-link-btn ${activeCategory === null ? "active" : ""}`}
                      onClick={() => selectCategory(null)}
                      aria-pressed={activeCategory === null}
                    >
                      All posts
                    </button>
                  </li>
                  {CATEGORIES.map((cat) => (
                    <li key={cat}>
                      <button
                        type="button"
                        className={`filter-link filter-link-btn ${activeCategory === cat ? "active" : ""}`}
                        onClick={() => selectCategory(cat)}
                        aria-pressed={activeCategory === cat}
                      >
                        {cat}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* ============ POSTS ============ */}
            <div className="col-12 col-lg-9">
              {posts.length === 0 ? (
                <p className="text-center py-5">
                  No posts in {activeCategory} yet.
                </p>
              ) : (
                <div className="row gy-3">
                  {posts.map((post) => (
                    <div className="col-12 col-sm-6" key={post.slug}>
                      <BlogCard post={post} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Blog;
