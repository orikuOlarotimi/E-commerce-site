import axios from 'axios';
import API_URL from "../config/app";

export const getCart = async () => {
  const res = await axios.get(`${API_URL}/api/cart`, { withCredentials: true });
  return res.data;
};

export const addToCart = async (productId, quantity = 1) => {
  const res = await axios.post(
    `${API_URL}/api/cart/add`,
    { productId, quantity },
    { withCredentials: true },
  );
  return res.data;
};

export const removeFromCart = async (productId) => {
  const res = await axios.delete(`${API_URL}/api/cart/remove/${productId}`, {
    withCredentials: true,
  });
  return res.data;
};

export const updateCartQuantity = async (productId, quantity) => {
  const res = await axios.put(
    `${API_URL}/api/cart/update`,
    { productId, quantity },
    { withCredentials: true },
  );
  return res.data;
};
