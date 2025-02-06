import React, { useEffect, useState } from "react";
import Navbar from "../Navbar/Navbar";
import axios from "axios";
import Loading_Animation from "../Animation/Loading_Animation";
import Lottie from 'lottie-react';
import "./Cart.css";
import Empty from "./empty.json"

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

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
      setCartItems(data.filter(item => item.userId === userData._id));
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
                <h2>Your Cart is Empty !</h2>
                <Lottie className="empty-img" animationData={Empty} loop={true} />
              </div>
            ) : (
              cartItems.map(item => (
                <>
                  <div key={item._id} className="cart-item">
                    <img src={item.productImage} alt={item.productName} />
                    <div className="cart-item-details">
                      <h2>{item.productName}</h2>
                      <p>Units: {item.productUnit}</p>
                      <p className="price">₹{item.productPrice}</p>
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
                    <td className="item-row">{item.productName}</td>
                    <td>₹{item.productPrice}</td>
                  </tr>
                ))}
                <tr>
                  <td className="total-row"><b>Total</b></td>
                  <td><b>₹{cartItems.reduce((acc, item) => acc + item.productPrice, 0)}</b></td>
                </tr>
                <tr>
                  <td colSpan="2">
                    <button>ORDER ALL</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}

export default Cart;
