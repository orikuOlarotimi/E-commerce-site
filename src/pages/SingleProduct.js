import React, { useState } from "react";
import Meta from "../components/Meta";
import BreadCrumb from "../components/BreadCrumb";
import ProductCard from "../components/ProductCard";
import ReactStars from "react-rating-stars-component";

const SingleProduct = () => {
  const [orderedProduct, setorderedProduct] = useState(true);
  return (
    <>
      <Meta title={"Product Name"}></Meta>
      <BreadCrumb title=" Product Name" />
      <div className="main-product-wrapper py-5 home-wrapper-2">
        <div className="container-xxl ">
          <div className="row">
            <div className="col-6">
              <div className="main-product-image">
                <div>ass</div>
              </div>
            </div>
            <div className="col-6">skks</div>
          </div>
        </div>
      </div>
      <div className="description-wrapper py-5  home-wrapper-2">
        <div className="container-xxl">
          <div className="row">
            <div className="col-12">
              <h4>Description</h4>
              <div>
                <div className="bg-white p-3">
                  <p>
                    bsfkjbfssh asbdjbjkabdkasbdjs abskjdbksbhdads
                    ansdwdleukdjasd abdkajbdjasb hjxe hbqdbkjbkjxsabxhw
                    xvsjhbsakxh uiwhduieejh buiekhebuhhhhhhhhhhhhhhhhhhh
                    hhhhhhhhhhhhhhhhhh hhhhhhhhhhhhhhhh hhhhhhhhhdddhhhhhhhhhhhh
                    hhhhhhhhh hhhhhhhdhuksahdkbhjbb,hm,bajcbsjhc, mbh
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="reviews-wrapper pb-5 home-wrapper-2">
        <div className="container-xxl">
          <div className="row">
            <div className="col-12">
              <h3> Reviews</h3>
              <div className="review-inner-wrapper">
                <div className="review-head d-flex justify-content-between align-items-end">
                  <div>
                    <h4 className="mb-2">Customer Reviews</h4>
                    <div className="d-flex align-items-center gap-10">
                      <ReactStars
                        count={5}
                        size={24}
                        value={4}
                        edit={false}
                        activeColor="#ffd700"
                      />
                      <p className="mb-0"> Based on 2 Reviews</p>
                    </div>
                  </div>
                  {orderedProduct && (
                    <div>
                      <a
                        className="text-dark text-decoration-underline"
                        href=""
                      >
                        Write A Review
                      </a>
                    </div>
                  )}
                </div>

                <div className="review-form py-4">
                  <h4> write a review</h4>
                  <form action="" className="d-flex flex-column gap-15">
                    <div>
                      <ReactStars
                        count={5}
                        size={24}
                        value={4}
                        edit={true}
                        activeColor="#ffd700"
                      />
                    </div>

                    <div>
                      <textarea
                        name=""
                        id=""
                        className="w-100 form-control"
                        cols="30"
                        rows="4"
                        placeholder="Comments"
                      ></textarea>
                    </div>
                    <div className="d-flex justify-content-end">
                      <button className="button border-0">Submit Review</button>
                    </div>
                  </form>
                </div>

                <div className="reviews mt-4">
                  <div className="review">
                    <div className="d-flex gap-10 align-items-center">
                      <h6 className="mb-0"> Navdeep</h6>
                      <ReactStars
                        count={5}
                        size={24}
                        value={4}
                        edit={true}
                        activeColor="#ffd700"
                      />
                    </div>
                    <p className="mt-3">
                      ucnjdscnds dhkshdksh ksdhkshdkhskdhs skhdkshdkshd
                      kshdkshdkshdksh kskjd
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="popular-wrapper py-5 home-wrapper-2">
        <div className="container-xxl">
          <div className="row">
            <div className="col-12">
              <h3 className="section-heading">Our Popular Products</h3>
            </div>
            <ProductCard></ProductCard>
          </div>
        </div>
      </section>
    </>
  );
};

export default SingleProduct;
