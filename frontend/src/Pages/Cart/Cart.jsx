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
      setCartItems(data.map(item => ({ ...item, quantity: item.quantity || 1 })));
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
    try {
      await axios.delete(`http://localhost:8080/cart/remove/${itemId}`);
      alert("Item removed from cart");
      fetchCartItems();
    } catch (error) {
      alert("Failed to remove item");
      console.error("Remove error:", error);
    }
  };

  const calculateOffer = (previousPrice, currentPrice) => {
    if (previousPrice && previousPrice > currentPrice) {
      return `${Math.round(((previousPrice - currentPrice) / previousPrice) * 100)}% off`;
    }
    return null;
  };

  const handleQuantityChange = (itemId, delta) => {
    setCartItems(prevItems => prevItems.map(item => {
      if (item._id === itemId) {
        const newQuantity = item.quantity + delta;
        return { ...item, quantity: newQuantity > 0 ? newQuantity : 1 };
      }
      return item;
    }));
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
                          <p className="previous-price"><strike>{item.product.productPreviousPrice}</strike></p>
                        )}
                        {item.product.productPreviousPrice && item.product.productPreviousPrice > item.product.productPrice && (
                          <p className="offer">{calculateOffer(item.product.productPreviousPrice, item.product.productPrice)}</p>
                        )}
                      </div>
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
                  <hr />
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
