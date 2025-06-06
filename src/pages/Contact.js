import React from 'react';
import Meta from '../components/Meta';
import BreadCrumb from '../components/BreadCrumb';
import {AiOutlineHome, AiOutlineMail} from "react-icons/ai";
import {BiPhoneCall, BiInfoCircle} from "react-icons/bi";

const Contact = () => (
  <>
    <Meta title={"Contact Us"}></Meta>
    <BreadCrumb title="Contact Us" />
    <div className='contact-wrapper py-5 home-wrapper-2'>
      <div className='container-xxl'>
        <div className='row'>
          <div className='col-12'>
            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d127077.232801687!2d5.690027251707822!3d5.542754903327853!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1041b2ee387d1067%3A0x35957f67d789a763!2sWarri%2C%20Delta!5e0!3m2!1sen!2sng!4v1683963623011!5m2!1sen!2sng" width="600" height="450" className='border-0 w-100' allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
          </div>
          <div className='col-12 mt-5'>
            <div className='contact-inner-wrapper justify-content-between d-flex'>
              <div><h3 className='contact-title mb-4 '> Contact </h3>
                <form action='' className='d-flex flex-column gap-15'>
                  <div> <input type='text' className='form-control' placeholder='Name'></input> </div>
                  <div> <input type='email' className='form-control' placeholder='Email'></input> </div>
                  <div> <input type='tel' className='form-control' placeholder='Mobile Number'></input> </div>
                  <div> <textarea name='' id='' className='w-100 form-control' cols="30" rows="4" placeholder='Comments'></textarea> </div>
                  <div>
                    <button className='button border-0'> Submit</button>
                  </div>
                </form>
              </div>
              <div>
                <h3 className='contact-title mb-4'> Get in touch with us </h3>
                <ul className='ps-0'>
                  <li className='mb-3 d-flex gap-15 align-items-center'> <AiOutlineHome  className='fs-5' /> 
                  <address className='mb-0'> Nepa School , Ogoode , Sapele , Delta State, Nigeria</address>
                  </li>
                  <li className='mb-3 d-flex gap-15 align-items-center'> <BiPhoneCall className='fs-5' /> 
                  <a href='tel: +234 814 0396 486'> +223 8140396486</a>
                  </li>
                  <li className='mb-3 d-flex gap-15 align-items-center'> <AiOutlineMail className='fs-5'/>
                      <a href='mailto: rotimipraise07@gmail.com'>  rotimipraise07@gmail.com</a>
                  </li>
                  <li className='mb-3 d-flex gap-15 align-items-center'>  <BiInfoCircle className='fs-5' />
                      <p className='mb-0'> Monday - Friday 10 AM - 8 PM</p>
                  </li>
                </ul>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>

  </>
)

export default Contact
