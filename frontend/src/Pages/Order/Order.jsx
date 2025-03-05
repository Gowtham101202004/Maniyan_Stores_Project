import React, { useEffect, useState } from "react";
import Navbar from "../Navbar/Navbar";
import axios from "axios";
import "./Order.css";

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const user = JSON.parse(localStorage.getItem("userdata"));

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user || !user._id) {
        setError("User not found. Please log in.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`http://localhost:8080/order/get-orders?userId=${user._id}`);
        setOrders(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const calculateTotalAmount = (products) => {
    const productTotal = products.reduce((total, product) => total + product.price * product.quantity, 0);
    return productTotal + 40; // Adding delivery charge
  };

  const getProgressPercentage = (status) => {
    switch (status) {
      case "Ordered":
        return 20;
      case "Shipped":
        return 40;
      case "Arrived":
        return 60;
      case "Delivered":
        return 100;
      default:
        return 0;
    }
  };

  return (
    <>
      <Navbar />
      <div className="order-container">
        <h2 className="order-title">Your Orders</h2>
        {loading ? (
          <div className="order-loading">Loading orders...</div>
        ) : error ? (
          <div className="order-error-message">{error}</div>
        ) : orders.length === 0 ? (
          <p className="order-no-orders">No orders found.</p>
        ) : (
          orders.map((order) => (
            <div key={order._id} className="order-card">
              <div className="order-header">
                <div className="order-info">
                  <p className="order-date"><b>Order Date : </b>{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="order-status">
                  <p className={`order-payment-status ${order.paymentDetails.payment_status === "paid" ? "paid" : "pending"}`}>
                    <span> Payment Status : </span>{order.paymentDetails.payment_status}
                  </p>
                  <p className="order-product-status">Product Status : <span>{order.orderStatus || "Processing"}</span></p>
                </div>
              </div>
              <div className="order-details">
                <div className="order-products">
                  {order.productDetails.map((product, index) => (
                    <div key={index} className="order-product">
                      <img src={product.image[0]} alt={product.name} className="product-image" />
                      <div className="product-details">
                        <p className="product-name">{product.name}</p>
                        <p className="product-quantity">Quantity: {product.quantity}</p>
                        <p className="product-price">₹{product.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="order-tracking">
                  <div className="tracking-progress">
                    <div className="tracking-line" style={{ width: `${getProgressPercentage(order.orderStatus)}%` }}></div>
                    <div className={`tracking-step ${order.orderStatus === "Ordered" ? "active" : ""}`}>
                      <span className="step-icon">✔</span>
                      <span className="step-label">Ordered</span>
                    </div>
                    <div className={`tracking-step ${order.orderStatus === "Shipped" ? "active" : ""}`}>
                      <span className="step-icon">✔</span>
                      <span className="step-label">Shipped</span>
                    </div>
                    <div className={`tracking-step ${order.orderStatus === "Arrived" ? "active" : ""}`}>
                      <span className="step-icon">✔</span>
                      <span className="step-label">Arrived</span>
                    </div>
                    <div className={`tracking-step ${order.orderStatus === "Delivered" ? "active" : ""}`}>
                      <span className="step-icon">✔</span>
                      <span className="step-label">Delivered</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="order-footer">
                <p className="order-total-amount">
                  Total Amount: ₹{calculateTotalAmount(order.productDetails)} (Incl. ₹40 Delivery Charge)
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default Order;