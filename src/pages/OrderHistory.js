import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchOrders = async () => {
      try {
        const res = await axios.get("/api/orders/my-orders", { withCredentials: true });
        setOrders(res.data);
      } catch (error) {
        console.error("Failed to fetch orders", error);
      }
    };

    fetchOrders();
  }, [user, navigate]);

  return (
    <div className="container mt-5">
      <h2>Order History</h2>
      {orders.length === 0 ? (
        <p>You have no past orders.</p>
      ) : (
        orders.map((order) => (
          <div key={order._id} className="border p-3 mb-3 rounded">
            <p><strong>Order ID:</strong> {order._id}</p>
            <p><strong>Status:</strong> {order.paymentStatus}</p>
            <p><strong>Total:</strong> ${order.totalAmount.toFixed(2)}</p>
            <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleString()}</p>
            <ul>
              {order.products.map((item, index) => (
                <li key={index}>
                  {item.product?.title || "Product deleted"} — Qty: {item.quantity}
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );
};

export default OrderHistory;
