import axios from 'axios';

export const getCart = async () => {
  const res = await axios.get('http://localhost:5000/api/cart', { withCredentials: true });
  return res.data;
};

export const addToCart = async (productId, quantity = 1) => {
  const res = await axios.post('http://localhost:5000/api/cart/add', { productId, quantity }, { withCredentials: true });
  return res.data;
};

export const removeFromCart = async (productId) => {
  const res = await axios.delete(`http://localhost:5000/api/cart/remove/${productId}`, { withCredentials: true });
  return res.data;
};

export const updateCartQuantity = async (productId, quantity) => {
  const res = await axios.put('http://localhost:5000/api/cart/update', { productId, quantity }, { withCredentials: true });
  return res.data;
};
