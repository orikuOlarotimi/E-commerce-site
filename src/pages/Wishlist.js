import React from 'react'
import Meta from '../components/Meta'
import BreadCrumb from '../components/BreadCrumb'

const Wishlist = () => {
  return (
    <>
     <Meta title={"Wishlist"}></Meta>
     <BreadCrumb title=" Wishlist" />
     <div className='wishlist-wrapper home-wrapper-2 py-5'>
      <div className='container-xxl'>
         <div className='row'>
            <div className='col-3'>
               <div className='wishlist-card position-relative'>
                  <img src='images/cross.svg' alt='cross' className='position-absolute cross img-fluid'></img >
                  <div className='wishlist-card-image'>
                     <img src='images/watch.jpg' className='img-fluid w-100' alt='watch'></img>
                  </div>
                  <div className='py-3 px-3'> <h5 className='title'>  Honor Ti 7.0 1GB RAM 8GB ROM 7 Inch With WI-Fi + 3G Tablet</h5>
                  <h6 className='price'> $ 100 </h6></div>
               </div>
            </div>
            <div className='col-3'>
               <div className='wishlist-card position-relative'>
                  <img src='images/cross.svg' alt='cross' className='position-absolute cross img-fluid'></img >
                  <div className='wishlist-card-image'>
                     <img src='images/watch.jpg' className='img-fluid w-100' alt='watch'></img>
                  </div>
                  <div className='py-3 px-3'> <h5 className='title'>  Honor Ti 7.0 1GB RAM 8GB ROM 7 Inch With WI-Fi + 3G Tablet</h5>
                  <h6 className='price'> $ 100 </h6></div>
               </div>
            </div>
            <div className='col-3'>
               <div className='wishlist-card position-relative'>
                  <img src='images/cross.svg' alt='cross' className='position-absolute cross img-fluid'></img >
                  <div className='wishlist-card-image'>
                     <img src='images/watch.jpg' className='img-fluid w-100' alt='watch'></img>
                  </div>
                  <div className='py-3 px-3'> <h5 className='title'>  Honor Ti 7.0 1GB RAM 8GB ROM 7 Inch With WI-Fi + 3G Tablet</h5>
                  <h6 className='price'> $ 100 </h6></div>
               </div>
            </div>
         </div>
      </div>
      </div>    
    </>
  )
}

export default Wishlist
