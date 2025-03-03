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
    return cartItems.reduce((totalSaved, item) => {
      const itemPriceSaved = item.product.productPreviousPrice - item.product.productPrice;
      if (itemPriceSaved > 0) {
        return totalSaved + itemPriceSaved * item.quantity;
      }
      return totalSaved;
    }, 0);
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
                    <p className="stock">In Stock: {item.product.productStock}</p>
                    <div className="quantity-controls">
                      <button onClick={() => handleQuantityChange(item._id, -1)}>-</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => handleQuantityChange(item._id, 1)}>+</button>
                    </div>
                  </div>
                  <div className="class-item-button">
                    <button>BUY NOW</button>
                    <button className="remove-button" onClick={() => handleRemoveFromCart(item._id)}>REMOVE</button>
                  </div>
                </div>
                <div className="class-item-button-mobile">
                    <button>BUY NOW</button>
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
                    <td className="total-row"><b>Total</b></td>
                    <td><b>₹{cartItems.reduce((acc, item) => acc + (item.product.productPrice * item.quantity), 0)}</b></td>
                  </tr>
                  <tr>
                    <td className="total-row"><b>You Saved</b></td>
                    <td><b>₹{calculateTotalSaved()}</b></td>
                  </tr>
                  <tr>
                    <td colSpan="2">
                      <button>ORDER ALL</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default Cart;