import React from 'react'
import { Link } from 'react-router-dom'

const BlogCard = () => {
  return (
         <div className='Blog-card'>
            <div className='card-image'>
                <img src='images/blog-1.jpg' className='img-fluid w-100' alt='blog'></img>
            </div>
               <div className='blog-content '>
                     <p className='date'> 5, MAY, 2023</p>
                     <h5 className='title'>A BEAUTIFUL SUNDAY MORNING</h5>
                     <p className='desc'>lorem33ewjofwkefke        wiofjliqjfeje        dsds sdsdpwok fqle/fkewqflorem33</p>
                     <Link className='button' to="/blog/:id"> READ MORE</Link>
               </div>

         </div>
  )
}

export default BlogCard
