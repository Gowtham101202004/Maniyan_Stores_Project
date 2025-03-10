import React, { useState, useEffect } from 'react';
import './Gpay.css';
import gpay_qr from './gpay.png';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

const Gpay = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { product } = location.state || {}; 

  const [upiId, setUpiId] = useState('');
  const [amount, setAmount] = useState(product?.productPrice || ''); 

  useEffect(() => {
    if (!product) {
      alert("Product details not found. Redirecting to home...");
      navigate("/");
    }
  }, [product, navigate]);

  const handleUPIPayment = async () => {
    if (!upiId) {
      alert('Please enter UPI ID');
      return;
    }
  
    const upiIdRegex = /^[a-zA-Z0-9.\-_]{2,49}@[a-zA-Z]{2,}$/;
    if (!upiIdRegex.test(upiId)) {
      alert('Please enter a valid UPI ID.');
      return;
    }
  
    try {
      alert(`Payment of ₹${amount} to ${upiId} initiated!`);
  
      const userData = JSON.parse(localStorage.getItem("userdata"));
      if (!userData || !userData._id) {
        alert("Please log in first");
        return;
      }
  
      const orderPayload = {
        productDetails: [{
          name: product.productName,
          price: product.productPrice,
          quantity: 1,
          image: [product.productImage],
        }],
        email: userData.email,
        userId: userData._id,
        paymentDetails: {
          paymentId: `UPI-${Date.now()}`, 
          payment_method_type: ["UPI"],
          payment_status: "paid",
        },
        shippingOptions: [{
          shipping_amount: 4000, 
          shipping_rate: "shr_1QxTpj4UOuOwfYxghjdIwZcb",
        }],
        totalAmount: amount,
      };
  
      const response = await axios.post("http://localhost:8080/order/create-order", orderPayload);
      if (response.data.message === "Order created successfully") {
        alert("Order placed successfully!");
        navigate("/order"); 
      }
    } catch (error) {
      console.error("Error creating order:", error);
      alert("Failed to create order. Please try again.");
    }
  };

  const handleQRPayment = async () => {
    try {
      alert(`Payment of ₹${amount} to ${upiId} initiated!`);
  
      const userData = JSON.parse(localStorage.getItem("userdata"));
      if (!userData || !userData._id) {
        alert("Please log in first");
        return;
      }
  
      const orderPayload = {
        productDetails: [{
          name: product.productName,
          price: product.productPrice,
          quantity: 1,
          image: [product.productImage],
        }],
        email: userData.email,
        userId: userData._id,
        paymentDetails: {
          paymentId: `UPI-${Date.now()}`, 
          payment_method_type: ["UPI"],
          payment_status: "paid",
        },
        shippingOptions: [{
          shipping_amount: 4000, 
          shipping_rate: "shr_1QxTpj4UOuOwfYxghjdIwZcb",
        }],
        totalAmount: amount,
      };
  
      const response = await axios.post("http://localhost:8080/order/create-order", orderPayload);
      if (response.data.message === "Order created successfully") {
        alert("Order placed successfully!");
        navigate("/order"); 
      }
    } catch (error) {
      console.error("Error creating order:", error);
      alert("Failed to create order. Please try again.");
    }
  };

  return (
    <div className="gpay-container">
      <h1>UPI Payment</h1>

      <div className="upi-section">
        <div>
          <h3>Total Amount : ₹{amount}</h3>
        </div>
        <div className="input-group">
          <label>
            UPI ID:
            <input
              type="text"
              placeholder="Enter UPI ID (e.g., example@upi)"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
            />
          </label>
        </div>
        <button className="pay-button" onClick={handleUPIPayment}>
          Pay via UPI
        </button>
      </div>

      <div className="divider">
        <span>OR</span>
      </div>

      <div className="qr-section">
        <h2>Pay via QR Code</h2>
        <div className="qr-code-container">
          <img src={gpay_qr} alt="UPI QR Code" className="qr-code-image" />
          <button className="pay-button" onClick={handleQRPayment}>
            Pay via QR
          </button>
        </div>
      </div>
    </div>
  );
};

export default Gpay;