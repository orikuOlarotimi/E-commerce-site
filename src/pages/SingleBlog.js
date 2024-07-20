import React from 'react';
import Meta from "../components/Meta";
import BreadCrumb from "../components/BreadCrumb";
import { Link } from 'react-router-dom';
import {HiOutlineArrowLeft } from "react-icons/hi";

const SingleBlog = () => {
  return (
    <>
      <Meta title={"Dynamic Blog Name"}></Meta>
      <BreadCrumb title=" Dynamic Blog Name" />

      <div className="blog-wrapper home-wrapper-2 py-5">
        <div className="container-xxl">
          <div className="row">
            <div className="col-12">
              <div className="single-blog-card">
                <Link to="/blogs" className='d-flex align-items-center gap-10'> <HiOutlineArrowLeft className='fs-4' /> Go back to Blogs</Link>
                <h3 className="title">
                  A Beautiful Sunday Morning Renaissance
                </h3>
                <img
                  className="img-fluid w-100 my-4"
                  src="images/blog-1.jpg"
                  alt="blog"
                ></img>
                <p> You're only as good as your last collection, which is an enormous pressure. I think there is something about luxury, its not something people need, but its what they want. </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default SingleBlog
