import React from 'react';
import Meta from "../components/Meta";
import BreadCrumb from "../components/BreadCrumb";

const PrivacyPolicy = () => {
  return (
    <>
      <Meta title={"Privacy Policy"}></Meta>
      <BreadCrumb title=" Privacy Policy" />
      <section className="policy-wrapper py-5 home-wrapper-2">
        <div className="container-xxl">
          <div className="row">
            <div className="col-12">
              <div className="policy"></div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default PrivacyPolicy
