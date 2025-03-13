import React, { useState, useEffect } from 'react';
import './Gpay.css';
import gpay_qr from './gpay.png';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

const Gpay = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { product, cartItems } = location.state || {};

  const [upiId, setUpiId] = useState('');
  const [amount, setAmount] = useState(
    product
      ? product.productPrice 
      : cartItems?.reduce((total, item) => total + item.product.productPrice * item.quantity, 0) 
  );

  useEffect(() => {
    if (!product && (!cartItems || cartItems.length === 0)) {
      alert("No items found for payment. Redirecting to home...");
      navigate("/");
    }
  }, [product, cartItems, navigate]);

  const calculateTotalAmount = () => {
    const shippingAmount = 4000; 
    if (product) {
      const quantity = location.state.quantity || 1; 
      return (product.productPrice * quantity) + (shippingAmount / 100); 
    } else if (cartItems) {
      const totalProductAmount = cartItems.reduce((total, item) => total + item.product.productPrice * item.quantity, 0);
      return totalProductAmount + (shippingAmount / 100);
    }
    return 0;
  };

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
      const totalAmount = calculateTotalAmount();
      alert(`Payment of ₹${totalAmount} to ${upiId} initiated!`);
  
      const userData = JSON.parse(localStorage.getItem("userdata"));
      if (!userData || !userData._id) {
        alert("Please log in first");
        return;
      }
  
      const orderPayload = {
        productDetails: product
          ? [
              {
                name: product.productName,
                price: product.productPrice,
                quantity: location.state.quantity || 1,
                image: [product.productImage],
              },
            ]
          : cartItems.map((item) => ({
              name: item.product.productName,
              price: item.product.productPrice,
              quantity: item.quantity,
              image: [item.product.productImage],
            })),
        email: userData.email,
        userId: userData._id,
        address: userData.address,
        paymentDetails: {
          paymentId: `UPI-${Date.now()}`,
          payment_method_type: ["UPI"],
          payment_status: "paid",
        },
        shippingOptions: [
          {
            shipping_amount: 4000, 
            shipping_rate: "shr_1QxTpj4UOuOwfYxghjdIwZcb",
          },
        ],
        totalAmount: totalAmount,
      };
  
      const response = await axios.post("http://localhost:8080/order/create-order", orderPayload);
      if (response.data.message === "Order created successfully") {
        if (product) {
          const quantity = location.state.quantity || 1;
          try {
            const stockResponse = await axios.put(
              `http://localhost:8080/products/update-stock/${product._id}`,
              { quantity: quantity }
            );
            console.log("Stock update response:", stockResponse.data);
          } catch (error) {
            console.error("Error updating stock for single product:", error);
            alert("Failed to update stock for the product. Please contact support.");
          }
        }
        else if (cartItems) {
          for (const item of cartItems) {
            try {
              const stockResponse = await axios.put(
                `http://localhost:8080/products/update-stock/${item.product._id}`,
                { quantity: item.quantity }
              );
              console.log("Stock update response for cart item:", stockResponse.data);
            } catch (error) {
              console.error("Error updating stock for cart item:", error);
              alert("Failed to update stock for one or more cart items. Please contact support.");
            }
          }
        }
  
        navigate("/success");
      }
    } catch (error) {
      console.error("Error creating order:", error);
      alert("Failed to create order. Please try again.");
    }
  };

  const handleQRPayment = async () => {
    try {
      const totalAmount = calculateTotalAmount();
      alert(`Payment of ₹${totalAmount} initiated!`);

      const userData = JSON.parse(localStorage.getItem("userdata"));
      if (!userData || !userData._id) {
        alert("Please log in first");
        return;
      }

      const orderPayload = {
        productDetails: product
          ? [
              {
                name: product.productName,
                price: product.productPrice,
                quantity: location.state.quantity || 1,
                image: [product.productImage],
              },
            ]
          : cartItems.map((item) => ({
              name: item.product.productName,
              price: item.product.productPrice,
              quantity: item.quantity,
              image: [item.product.productImage],
            })),
        email: userData.email,
        userId: userData._id,
        address: userData.address,
        paymentDetails: {
          paymentId: `UPI-${Date.now()}`,
          payment_method_type: ["UPI"],
          payment_status: "paid",
        },
        shippingOptions: [
          {
            shipping_amount: 4000, 
            shipping_rate: "shr_1QxTpj4UOuOwfYxghjdIwZcb",
          },
        ],
        totalAmount: totalAmount,
      };

      const response = await axios.post("http://localhost:8080/order/create-order", orderPayload);
      if (response.data.message === "Order created successfully") {
        if (product) {
          const quantity = location.state.quantity || 1;
          try {
            const stockResponse = await axios.put(
              `http://localhost:8080/products/update-stock/${product._id}`,
              { quantity: quantity }
            );
            console.log("Stock update response:", stockResponse.data);
          } catch (error) {
            console.error("Error updating stock for single product:", error);
            alert("Failed to update stock for the product. Please contact support.");
          }
        }
        else if (cartItems) {
          for (const item of cartItems) {
            try {
              const stockResponse = await axios.put(
                `http://localhost:8080/products/update-stock/${item.product._id}`,
                { quantity: item.quantity }
              );
              console.log("Stock update response for cart item:", stockResponse.data);
            } catch (error) {
              console.error("Error updating stock for cart item:", error);
              alert("Failed to update stock for one or more cart items. Please contact support.");
            }
          }
        }
  
        navigate("/success");
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
          <h3>Total Amount : ₹{calculateTotalAmount()} (Incl. ₹40 Delivery Charge)</h3>
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