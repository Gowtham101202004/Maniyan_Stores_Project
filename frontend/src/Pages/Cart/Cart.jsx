import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import Loading_Animation from "../Animation/Loading_Animation";
import Lottie from 'lottie-react';
import "./Cart.css";
import Empty from "./empty.json";

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const navigate = useNavigate();

  const handleBackClick = () => navigate(-1);

  const fetchCartItems = async () => {
    const userData = JSON.parse(localStorage.getItem("userdata"));
    if (!userData || !userData._id) {
      alert("Please log in first");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data } = await axios.get(`http://localhost:8080/cart?userId=${userData._id}`);
      setCartItems(data.map(item => ({ 
        ...item, 
        quantity: item.quantity || 1,
        originalStock: item.product.productStock,
        product: {
          ...item.product,
          productStock: item.product.productStock - (item.quantity || 1) 
        }
      })));
    } catch (error) {
      console.error("Error fetching cart items:", error);
    } finally {
      setTimeout(() => setLoading(false), 300);
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  const handleRemoveFromCart = async (itemId) => {
    const userData = JSON.parse(localStorage.getItem("userdata"));
    if (!userData || !userData._id) {
      alert("Please log in first");
      return;
    }
  
    try {
      console.log("Removing item:", itemId);
      await axios.delete(`http://localhost:8080/cart/remove/${itemId}`, {
        data: { userId: userData._id },
        headers: { "Content-Type": "application/json" },
      });
  
      alert("Item removed from cart");
      fetchCartItems(); 
    } catch (error) {
      alert("Failed to remove item");
      console.error("Remove error:", error);
    }
  };

  const calculateOffer = (previousPrice, currentPrice, quantity) => {
    if (previousPrice && previousPrice > currentPrice) {
      return `${Math.round(((previousPrice - currentPrice) / previousPrice) * 100)}% off`;
    }
    return null;
  };

  const handleQuantityChange = (itemId, delta) => {
    setCartItems(prevItems => prevItems.map(item => {
      if (item._id === itemId) {
        const newQuantity = item.quantity + delta;

        if (newQuantity > 10) {
          alert("Sorry! Only 10 units allowed in each order");
          return item;
        }

        if (newQuantity < 1) return item;

        const updatedQuantity = newQuantity > 0 ? newQuantity : 1;
        const updatedStock = item.product.productStock - delta;

        if (updatedStock > item.originalStock) {
          return item;
        }

        if (updatedStock < 0) {
          alert("Not enough stock available");
          return item;
        }

        return { 
          ...item, 
          quantity: updatedQuantity,
          product: {
            ...item.product,
            productStock: updatedStock
          }
        };
      }
      return item;
    }));
  };

  const calculateTotalSaved = () => {
    const subtotalSaved = cartItems.reduce((totalSaved, item) => {
      const itemPriceSaved = item.product.productPreviousPrice - item.product.productPrice;
      if (itemPriceSaved > 0) {
        return totalSaved + itemPriceSaved * item.quantity;
      }
      return totalSaved;
    }, 0);

    const deliveryCharge = 40;
    return subtotalSaved - deliveryCharge; 
  };

  const calculateTotalAmount = () => {
    const subtotal = cartItems.reduce((acc, item) => acc + (item.product.productPrice * item.quantity), 0);
    const deliveryCharge = 40;
    return subtotal + deliveryCharge;
  };

  const handleOrderAll = async () => {
    setShowPaymentModal(true);
    setSelectedItem(null);
  };

  const handleBuyNow = async (item) => {
    setSelectedItem(item);
    setShowPaymentModal(true);
  };

  const handlePaymentMethodSelect = (method) => {
    setShowPaymentModal(false);
    if (method === "card") {
      handleCardPayment(selectedItem);
    } else if (method === "upi") {
      if (selectedItem) {
        navigate("/google-payment", { 
          state: { 
            product: selectedItem.product, 
            quantity: selectedItem.quantity 
          } 
        });
      } else if (cartItems.length > 0) {
        navigate("/google-payment", { state: { cartItems } });
      } else {
        alert("No items in the cart!");
      }
    } else if (method === "cod") {
      handleCashOnDelivery(selectedItem);
    }
  };

  const handleCardPayment = async (selectedItem) => {
    const userData = JSON.parse(localStorage.getItem("userdata"));
    if (!userData || !userData._id) {
      alert("Please log in first");
      return;
    }

    const payload = {
      cartItems: selectedItem
        ? [{
            product: selectedItem.product._id,
            name: selectedItem.product.productName,
            images: [selectedItem.product.productImage],
            price: selectedItem.product.productPrice,
            quantity: selectedItem.quantity,
          }]
        : cartItems.map(item => ({
            product: item.product._id,
            name: item.product.productName,
            images: [item.product.productImage],
            price: item.product.productPrice,
            quantity: item.quantity,
          })),
      email: userData.email,
    };

    try {
      const response = await axios.post("http://localhost:8080/payment/checkout", payload);
      if (response.data.url) {
        window.location.href = response.data.url;
      }
    } catch (error) {
      console.error("Error during checkout:", error);
      alert("Failed to proceed to checkout!");
    }
  };

  const handleCashOnDelivery = (selectedItem) => {
    alert("Cash on Delivery selected. Your order will be confirmed shortly!");
    // Add logic to handle COD order confirmation
  };

  return (
    <>
      <Navbar />
      {loading ? (
        <div className="loading-wrapper">
          <Loading_Animation />
        </div>
      ) : (
        <div className="cart-container">
          <div className="cart-left">
            {cartItems.length === 0 ? (
              <div className="cart-item-empty">
                <h2>Your Cart is Empty!</h2>
                <Lottie className="empty-img" animationData={Empty} loop={true} />
              </div>
            ) : (
              cartItems.map(item => (
                <>
                <div key={item._id} className="cart-item">
                  <button className="back-button" onClick={handleBackClick}>
                    <FontAwesomeIcon icon={faArrowLeft} className="faArrowLeft" />
                  </button>
                  <img src={item.product.productImage} alt={item.product.productName} />
                  <div className="cart-item-details">
                    <h2>{item.product.productName}</h2>
                    <p>Units: {item.product.productUnit}</p>
                    <div className="cart-item-details-a">
                      <p className="price">₹{item.product.productPrice * item.quantity}</p>
                      {item.product.productPreviousPrice && (
                        <p className="previous-price"><strike>{item.product.productPreviousPrice * item.quantity}</strike></p>
                      )}
                      {item.product.productPreviousPrice && item.product.productPreviousPrice > item.product.productPrice && (
                        <p className="offer">{calculateOffer(item.product.productPreviousPrice, item.product.productPrice, item.quantity)}</p>
                      )}
                    </div>
                    <p className={`stock ${item.product.productStock === 0 || item.product.productStock < 10 ? "low-stock" : ""}`}>
                      {item.product.productStock === 0
                      ? "Out of Stock!"
                      : item.product.productStock < 10
                      ? `Only ${item.product.productStock} left!`
                      : `In Stock: ${item.product.productStock}`}
                    </p>
                    <div className="quantity-controls">
                      <button onClick={() => handleQuantityChange(item._id, -1)}>-</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => handleQuantityChange(item._id, 1)}>+</button>
                    </div>
                  </div>
                  <div className="class-item-button">
                    <button onClick={() => handleBuyNow(item)}>BUY NOW</button>
                    <button className="remove-button" onClick={() => handleRemoveFromCart(item._id)}>REMOVE</button>
                  </div>
                </div>
                <div className="class-item-button-mobile">
                    <button onClick={() => handleBuyNow(item)}>BUY NOW</button>
                    <button className="remove-button" onClick={() => handleRemoveFromCart(item._id)}>REMOVE</button>
                  </div>
                <hr/>
                </>
              ))
            )}
          </div>
          {cartItems.length > 0 && (
            <div className="cart-right">
              <table className="cart-summary-table">
                <thead>
                  <tr>
                    <th colSpan="2" className="cart-summary-heading">Cart Summary</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item, index) => (
                    <tr key={index}>
                      <td className="item-row">{item.product.productName} <b>(Quantity {item.quantity})</b></td>
                      <td>₹{item.product.productPrice * item.quantity}</td>
                    </tr>
                  ))}
                  <tr>
                    <td className="total-row"><b>Delivery Charge</b></td>
                    <td><b>₹40</b></td>
                  </tr>
                  <tr>
                    <td className="total-row"><b>Total</b></td>
                    <td><b>₹{calculateTotalAmount()}</b></td>
                  </tr>
                  {calculateTotalSaved() > 0 && (
                  <tr>
                    <td className="total-row"><b>You Saved</b></td>
                    <td><b>₹{calculateTotalSaved()}</b></td>
                  </tr>
                  )}
                  <tr>
                    <td colSpan="2">
                      <button onClick={handleOrderAll}>ORDER ALL</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {showPaymentModal && (
        <div className="payment-modal-overlay">
          <div className="payment-modal">
            <h2>Select Payment Method</h2>
            <button onClick={() => handlePaymentMethodSelect("card")}>Debit/Credit Card</button>
            <button onClick={() => handlePaymentMethodSelect("upi")}>UPI Payment</button>
            <button onClick={() => handlePaymentMethodSelect("cod")}>Cash on Delivery</button>
            <button onClick={() => setShowPaymentModal(false)}>Close</button>
          </div>
        </div>
      )}
    </>
  );
}

export default Cart;