import React, { useEffect, useState } from "react";
import Navbar from "../Navbar/Navbar";
import axios from "axios";
import "./Cart.css";

function Cart() {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const fetchCartItems = async () => {
      const userData = JSON.parse(localStorage.getItem("userdata"));
      if (!userData || !userData._id) {
        alert("Please log in first");
        return;
      }

      try {
        const { data } = await axios.get(`http://localhost:8080/cart?userId=${userData._id}`);
        setCartItems(data.filter(item => item.userId === userData._id)); // Ensure only user's cart items are shown
      } catch (error) {
        console.error("Error fetching cart items:", error);
      }
    };

    fetchCartItems();
  }, []);

  const handleRemoveFromCart = async (itemId) => {
    try {
      await axios.delete(`http://localhost:8080/cart/remove/${itemId}`);
      setCartItems(cartItems.filter(item => item._id !== itemId));
      alert("Item removed from cart");
    } catch (error) {
      alert("Failed to remove item");
      console.error("Remove error:", error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="cart-container">
        <div className="cart-left">
          {cartItems.length === 0 ? (
            <p>Your cart is empty</p>
          ) : (
            cartItems.map(item => (
              <div key={item._id} className="cart-item">
                <img src={item.productImage} alt={item.productName} />
                <div className="cart-item-details">
                  <h2>{item.productName}</h2>
                  <p>Units: {item.productUnit}</p>
                  <p className="price">₹{item.productPrice}</p>
                </div>
                <div className="class-item-button">
                  <button>BUY NOW</button>
                  <button onClick={() => handleRemoveFromCart(item._id)}>REMOVE</button>
                </div>
              </div>
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
                <td className="total-row">Total</td>
                <td>₹{cartItems.reduce((acc, item) => acc + item.productPrice, 0)}</td>
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
    </>
  );
}

export default Cart;
