import React, { useEffect, useState, useContext } from 'react';
import Meta from '../components/Meta';
import BreadCrumb from '../components/BreadCrumb';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Wishlist = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch wishlist when user or page loads
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchWishlist = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/wishlist/get-wishlist', {
          withCredentials: true,
        });
        setWishlistItems(res.data);
      } catch (error) {
        console.error('Failed to fetch wishlist:', error);
        toast.error('Could not load wishlist.');
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [user, navigate]);

  // Add product to wishlist
  // const addToWishlist = async (productId) => {
  //   try {
  //     await axios.post('http://localhost:5000/api/wishlist/add-wishlist', { productId }, {
  //       withCredentials: true,
  //     });
  //     toast.success('Added to wishlist');
  //     // Refresh wishlist
  //     setWishlistItems(prev => [...prev, wishlistItems.find(p => p._id === productId)]); // optimistic or refetch
  //     // Or refetch:
  //     // fetchWishlist();
  //   } catch (error) {
  //     toast.error(error.response?.data?.message || 'Failed to add to wishlist');
  //   }
  // };

  // Remove product from wishlist
  const removeFromWishlist = async (productId) => {
    try {
      await axios.delete(`http://localhost:5000/api/wishlist/remove-wishlist/${productId}`, {
        withCredentials: true,
      });
      toast.success('Removed from wishlist');
      setWishlistItems((prev) => prev.filter(item => item._id !== productId));
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to remove from wishlist');
    }
  };

  if (loading) return <div>Loading wishlist...</div>;

  return (
    <>
      <Meta title="Wishlist" />
      <BreadCrumb title="Wishlist" />
      <div className="wishlist-wrapper home-wrapper-2 py-5">
        <div className="container-xxl">
          <div className="row">
            {wishlistItems.length === 0 ? (
              <div className="col-12 text-center">
                <h5>Your wishlist is empty.</h5>
              </div>
            ) : (
              wishlistItems.map((item) => (
                <div className="col-3" key={item._id}>
                  <div className="wishlist-card position-relative">
                  <img src='images/cross.svg' alt='cross' className='position-absolute cross img-fluid' onClick={() => removeFromWishlist(item._id)}></img >
                    <div className="wishlist-card-image">
                      <img
                        src={item.images?.[0] || '/placeholder.png'}
                        className="img-fluid w-100"
                        alt={item.title}
                      />
                    </div>
                    <div className="py-3 px-3">
                      <h5 className="title">{item.title}</h5>
                      <h6 className="price">${item.price}</h6>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Wishlist;


