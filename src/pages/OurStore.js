import React, { useState, useEffect } from 'react';
import BreadCrumb from '../components/BreadCrumb';
import Meta from '../components/Meta';
import ReactStars from "react-rating-stars-component";
import ProductCard from "../components/ProductCard";
import Color from '../components/Color';
import axios from 'axios';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useParams } from "react-router-dom";




const OurStore = () => {
   const [grid, setGrid] = useState(5);
   const [sortOption, setSortOption] = useState("title-ascending");
   const { categoryName } = useParams();
   const [categories, setCategories] = useState([]);
   const location = useLocation();
      const [products, setProducts] = useState([]);
      const searchParams = new URLSearchParams(location.search);
   const searchQuery = searchParams.get('search')?.toLowerCase() || '';


   const filteredProducts = products.filter(product => {
      const matchesCategory = categoryName
        ? product.category.toLowerCase() === categoryName.toLowerCase()
        : true; // if no category selected, don't filter by category
    
      const matchesSearch = searchQuery
        ? product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.category.toLowerCase().includes(searchQuery.toLowerCase())
        : true; // if no search query, don't filter by search
    
      return matchesCategory && matchesSearch;
    });
   
   const sortedProducts = [...filteredProducts].sort((a, b) => {
      switch (sortOption) {
         case "title-ascending":
           return a.title.localeCompare(b.title);
         case "title-descending":
           return b.title.localeCompare(a.title);     
        case "price-ascending":
          return a.price - b.price;
        case "price-descending":
          return b.price - a.price;
        default:
          return 0;
      }
    });

   useEffect(() => {
      const fetchProducts = async () => {
        try {
          const res = await axios.get('http://localhost:5000/api/products/all'); // adjust URL to your backend route
          setProducts(res.data);
        } catch (error) {
          console.error('Failed to fetch products', error);
        }
      };
      fetchProducts();
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
   return (
   <>
   <Meta title={"Our Store"}></Meta>
         <BreadCrumb title=" Our Store" />
         <div className='store.wrapper home-wrapper-2 py-5'>
         <div className='container-xxl'>
            <div className='row'>
                  <div className='col-3'>
                     <div className='filter-card mb-3'>
                        <h3 className='filter-title'>
                           Shop By Categories
                        </h3>
                        <div>
                               <ul className='ps-0'>
                               {categories.map(cat => (
                                     <li key={cat._id}>
                                       <Link className="dropdown-item text-black" to={`/category/${cat.category}`}>
                                         {cat.category}
                                       </Link>
                                     </li>
                                   ))}
                           </ul>
                        </div>
                     </div>
                  </div>
                  <div className='col-9'>
                     <div className='filter-sort-grid mb-4'>
                     <div className='d-flex justify-content-between align-items-center'>
                         <div className='d-flex align-items-center gap-10'>
                        <p className='mb-0 d-block ' style={{"width":"100px" }}> Sort By: </p>
                        <select name=""
  className="form-control form-select"
  id=""
  value={sortOption}
  onChange={(e) => setSortOption(e.target.value)}>
                           <option value="title-ascending">Alphabetically, A-Z</option>
                           <option value="title-descending">Alphabetically, Z-A</option>
                           <option value="price-ascending">Price, low to high</option>
                           <option value="price-decending">Price, high to low</option>
                        </select>
                     </div>
                     <div className='d-flex align-items-center gap-10'> 
                        <p className='totalproducts mb-0'> {sortedProducts.length} Products</p>
                        <div className='d-flex gap-10 align-items-center grid'>
                           <img onClick={() => {setGrid(3);}} src='/images/gr4.svg' className='img-fluid d-block' alt='grid'></img>
                           <img onClick={() => {setGrid(4);}} src='/images/gr3.svg' className='img-fluid d-block' alt='grid'></img>
                           <img onClick={() => {setGrid(6);}} src='/images/gr2.svg' className='img-fluid d-block' alt='grid'></img>
                           <img onClick={() => {setGrid(12);}} src='/images/gr.svg' className='img-fluid d-block' alt='grid'></img>
                        </div>
                     </div>
                     </div>
                     </div>
                     <div className='products-list pb-5'>
                        <div className='d-flex gap-10 flex-wrap'>
                        {sortedProducts.length > 0 ? (
                                 sortedProducts.map(product => (
                                    <ProductCard key={product._id} product={product} grid={grid} />
                                 ))
                                 ) : (
                                 <p>No products found for "{searchQuery}"</p>
                                 )}
                        </div> 
                     </div>
                  </div> 
            </div>
         </div>
          </div>
   </>
  )
}

export default OurStore
