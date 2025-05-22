import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'
import Marquee from "react-fast-marquee";
import BlogCard from '../components/BlogCard';
import ProductCard from '../components/ProductCard';
import SpecialProduct from '../components/SpecialProduct';

const Home = () => {
  const [user, setUser] = useState(null);
  const [showWelcome, setShowWelcome] = useState(false);
  const [featured, setFeatured] = useState([]);
  const [famousProducts, setFamousProducts] = useState([]);
  const [specialProducts, setSpecialProducts] = useState([]);
  const [popularProducts, setPopularProducts] = useState([]);

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const storedUser = localStorage.getItem('customer');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setShowWelcome(true);

      // Hide welcome after 2 seconds
      const timer = setTimeout(() => {
        setShowWelcome(false);
        // Remove user from localStorage after hiding welcome
        localStorage.removeItem('customer');
      }, 1002500);

      // Cleanup timeout if component unmounts
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/products/categories'); // adjust if needed
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/products/featured');
        setFeatured(res.data);
      } catch (err) {
        console.error('Error fetching featured products:', err);
      }
    };

    fetchFeatured();
  }, []);

  useEffect(() => {
    const fetchFamous = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/products/famous');
        setFamousProducts(res.data);
      } catch (err) {
        console.error('Failed to fetch famous products:', err);
      }
    };

    fetchFamous();
  }, []);
  useEffect(() => {
    const fetchSpecialProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/products/special');
        setSpecialProducts(response.data);
      } catch (error) {
        console.error('Failed to fetch special products', error);
      }
    };

    fetchSpecialProducts();
  }, []);
  useEffect(() => {
    const fetchPopular = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/products/popular');
        setPopularProducts(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchPopular();
  }, []);

  return (
    <>
      <section className='home-wrapper-1 py-5'>
          <div className='container-xxl '>
              <div className='row'>
                  <div className='col-6'>
                      <div className='main-banner position-relative p-3'>
                          <img src='/images/main-banner-1.jpg' className='img-fluid rounded-3' alt='main banner'></img>
                          <div className='main-banner-content position-absolute'>
                              <h4>SUPERCHARGED FOR PROS.</h4>
                              <h5>ipad S13+ Pro</h5>
                              <p>From $999.00 or $41.62/mo.</p>
                              <Link className='button'> BUY NOW</Link>
                          </div>
                      </div>
                  </div>
                  <div className='col-6'>
                      <div className='d-flex flex-wrap gap-10 justify-content-between align-items-center'>
                           <div className='small-banner position-relative '>
                          <img src='/images/catbanner-01.jpg' className='img-fluid rounded-3' alt='main banner'></img>
                          <div className='small-banner-content position-absolute'>
                              <h4>BEST SALE</h4>
                              <h5>ipad S13+ Pro</h5>
                              <p>From $999.00 <br/>or $41.62/mo.</p>
                          </div>
                      </div>
                        <div className='small-banner position-relative '>
                          <img src='/images/catbanner-02.jpg' className='img-fluid rounded-3' alt='main banner'></img>
                            <div className='small-banner-content position-absolute'>
                              <h4>NEW ARRIVAL</h4>
                              <h5>BUY IPAD AIR</h5>
                              <p>From $999.00 <br/>or $41.62/mo.</p>
                            </div>
                       </div>
                       <div className='small-banner position-relative '>
                          <img src='/images/catbanner-03.jpg' className='img-fluid rounded-3' alt='main banner'></img>
                          <div className='small-banner-content position-absolute'>
                              <h4>SUPERCHARGED FOR PROS.</h4>
                              <h5>ipad S13+ Pro</h5>
                              <p>From $999.00 <br/>or $41.62/mo.</p>
                          </div>
                      </div>
                             <div className='small-banner position-relative '>
                          <img src='/images/catbanner-04.jpg' className='img-fluid rounded-3' alt='main banner'></img>
                          <div className='small-banner-content position-absolute'>
                              <h4>SUPERCHARGED FOR PROS.</h4>
                              <h5>ipad S13+ Pro</h5>
                              <p>From $999.00 <br/>or $41.62/mo.</p>
                          </div>
                      </div>
                      </div>
                  </div>
              </div>
          </div>
      </section>

      <section className='home-wrapper-2 py-5'>
        <div className='container-xxl'>
            <div className='row'>
                <div className='col-12'>
                    <div className='services d-flex align-items-center justify-content-between'>
                        <div className="d-flex align-items-center gap-15">
                           <img src='/images/service.png' alt='service'></img>
                           <div><h6>Free Shipping</h6>
                          <p className="mb-0" >From all Orders over $5</p></div>
                        </div>

                        <div className="d-flex align-items-center gap-15">
                           <img src='/images/service-02.png' alt='services'></img>
                          <div > <h6>Daily Surprise Offer</h6>
                          <p className="mb-0" >Save Upto 25% off</p></div>  
                        </div>
                        <div className="d-flex align-items-center gap-15">
                          <img src='/images/service-03.png' alt='services'></img>
                          <div> <h6>Support 24/</h6>
                          <p className="mb-0" >Shop with an expert</p></div> 
                        </div>
                        <div className="d-flex align-items-center gap-15">
                          <img src='/images/service-04.png' alt='services'></img>
                          <div> <h6>Affordable Prices</h6>
                          <p className="mb-0" > Get Factory Default Price</p> </div>
                        </div>
                        <div className="d-flex align-items-center gap-15">
                           <img src='/images/service-05.png' alt='services'></img>
                          <div > <h6> Secure Payments</h6>
                          <p className="mb-0" >100% Protected Payment</p></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </section>

      <section className='home-wapper-2 py-5'>
          <div className='container-xxl'>
              <div className='row'>
                  <div className='col-12'>
                      <div className='categories d-flex justify-content-between align-items-center flex-wrap'>
                      {categories.map((cat) => (
                <div key={cat.id} className='d-flex gap-30 align-items-center '  >
                  <div>
                    <h6>{cat.category}</h6>
                    <p>{cat.count} Items</p>
                  </div>
                  <img src={cat.image} alt={cat.category} style={{ width: '60px', height: '60px', objectFit: 'cover' }} />
                </div>
              ))}
                      </div>
                  </div>
              </div>
          </div>
      </section>

        <section className='featured-wrapper py-5 home-wrapper-2'>
                  <div className='container-xxl'>
                      <div className='row'>
                        <div className='col-12'>
                  <h3 className='section-heading'> Featued Collection</h3>
                         </div>
                         {featured.map((product) => (
                            <ProductCard key={product._id} product={product} />
                          ))}
                     </div>
                </div>
      </section>

      <section className='famous-wrapper py-5 home-wrapper-2'>
      <div className='container-xxl'>
          <div className='row'>
            <h2>Special Discounts</h2>
          {famousProducts.map((product, index) => {
            const discountedPrice = (product.price * (1 - product.discountPercentage / 100)).toFixed(2);
            return (
              <div className='col-4' key={index}>
                <div className='famous-card  '>
                  <img src={product.thumbnail} alt={product.title} className='img-fluid' />
                  <div className='famous-content '>
                    <h5 className='text-dark text-uppercase'>{product.category}</h5>
                    <h6 className='text-dark'>{product.title}</h6>
                    <p className='text-dark'>
                      Now from ${discountedPrice}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      </section>

      <section className='special-wrapper py-5 home-wrapper-2'>
          <div className='container-xxl'>
              <div className='row'>
                  <div className='col-12'>
                  <h3 className='section-heading'> Special product</h3>
                  </div>
              </div>
              <div className='row '>
              {specialProducts.map(product => (
                  <SpecialProduct key={product._id} product={product} />
                ))}
              </div>
          </div>
      </section>

         <section className='popular-wrapper py-5 home-wrapper-2'>
          <div className='container-xxl'>
              <div className='row'>
                  <div className='col-12'>
                  <h3 className='section-heading'>Our Popular Products</h3>
                  </div>
                  {popularProducts.map(product => (
            <ProductCard key={product._id} product={product} />
          ))}
              
              </div>
          </div>
      </section>
      <section className='marque-wrapper home-wrapper-2 py-5'>
          <div className='container-xxl'>
              <div className='row'>
                  <div className='col-12'>
                      <div className='maquee-inner-wrapper card-wrapper'>
                          <Marquee className='d-flex' >
                                 <div className='mx-4 w-25'><img src='/images/brand-01.png' alt='brand'></img> </div>
                                 <div className='mx-4 w-25'><img src='/images/brand-02.png' alt='brand'></img> </div>
                                 <div className='mx-4 w-25'><img src='/images/brand-03.png' alt='brand'></img> </div>
                                 <div className='mx-4 w-25'><img src='/images/brand-04.png' alt='brand'></img> </div>
                                 <div className='mx-4 w-25'><img src='/images/brand-05.png' alt='brand'></img> </div>
                                 <div className='mx-4 w-25'><img src='/images/brand-06.png' alt='brand'></img> </div>
                                 <div className='mx-4 w-25'><img src='/images/brand-07.png' alt='brand'></img> </div>
                                 <div className='mx-4 w-25'><img src='/images/brand-08.png' alt='brand'></img> </div>
                          </Marquee>
                      </div>
                  </div>
              </div>
          </div>
      </section>
      
      <section className='blog-wrapper py-5 home-wrapper-2'>
          <div className='container-xxl'>
              <div className='row'>
                <div className='col-12'>
                  <h3 className='section-heading'> Our Latest Blogs</h3>
                </div> 
              </div>
              <div className='row'>
                <div className='col-3'> 
                    <BlogCard></BlogCard>
                </div>
                 <div className='col-3'> 
                    <BlogCard></BlogCard>
                </div>
                 <div className='col-3'> 
                    <BlogCard></BlogCard>
                </div>
                 <div className='col-3'> 
                    <BlogCard></BlogCard>
                </div>
              </div>
          </div>
      </section>
    </>
  )
}

export default Home
