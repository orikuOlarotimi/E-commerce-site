import React from "react";
import { Link } from "react-router-dom";

// Placeholder content used until you pass a real `post`
const DEFAULT_POST = {
  _id: null,
  image: "/images/blog-1.jpg",
  date: "5 MAY 2023",
  title: "A BEAUTIFUL SUNDAY MORNING",
  excerpt:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
};

const BlogCard = ({ post }) => {
  const { _id, image, date, title, excerpt } = { ...DEFAULT_POST, ...post };

  return (
    <article className="Blog-card h-100 d-flex flex-column">
      <div className="card-image">
        <img
          src={image}
          className="img-fluid w-100"
          alt={title}
          loading="lazy"
        />
      </div>
      <div className="blog-content d-flex flex-column flex-grow-1">
        <p className="date">{date}</p>
        <h5 className="title">{title}</h5>
        <p className="desc">{excerpt}</p>
        {/* Was "/blog/:id" (a literal string). Falls back to the blog list until posts have ids. */}
        <Link
          className="button mt-auto align-self-start"
          to={_id ? `/blog/${_id}` : "/blogs"}
        >
          READ MORE
        </Link>
      </div>
    </article>
  );
};

export default BlogCard;
