import React from 'react';
import Meta from '../components/Meta';
import BreadCrumb from '../components/BreadCrumb';
import { Link } from "react-router-dom";
const Signup = () => {
  return (
    <>
      <Meta title={"Sign Up"}></Meta>
      <BreadCrumb title=" Sign Up" />

      <div className=" container-xxl login-wrapper py-5 home-wrapper-2">
        <div className="row">
          <div className="col-12">
            <div className=" auth-card">
              <h3 className="text-center mb-3">Sign up</h3>
              <form action="" className="d-flex flex-column gap-30">
                <div>
                  <input
                    type="text"
                    name="text"
                    placeholder="Name"
                    className="form-control"
                  ></input>
                </div>
                <div>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    className="form-control"
                  ></input>
                </div>
                <div>
                  <input
                    type="tel"
                    name="mobile"
                    placeholder="Mobile Number"
                    className="form-control"
                  ></input>
                </div>
                <div className="mt-1">
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    className="form-control"
                  ></input>
                </div>
                <div>
                  <div className=" mt-3 d-flex justify-content-center gap-15 align-items-center">
                    <button className="button border-0">Sign Up</button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Signup
