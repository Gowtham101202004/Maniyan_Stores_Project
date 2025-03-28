import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faCreditCard, faMobileAlt, faMoneyBillAlt, faEdit } from "@fortawesome/free-solid-svg-icons";
import Loading_Animation from "../Animation/Loading_Animation";
import Lottie from 'lottie-react';
import "./Cart.css";
import Empty from "./empty.json";

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [address, setAddress] = useState("");
  const [editAddress, setEditAddress] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const navigate = useNavigate();

  const handleBackClick = () => navigate(-1);

  const fetchCartItems = async () => {
    const userData = JSON.parse(localStorage.getItem("userdata"));

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

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userdata"));
    if (userData && userData.address) {
      setAddress(userData.address);
    }
  }, []);

  const handleRemoveFromCart = async (itemId) => {
    const userData = JSON.parse(localStorage.getItem("userdata"));
  
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
    const userData = JSON.parse(localStorage.getItem("userdata"));
    if (!userData || !userData._id) {
      alert("Please log in first");
      return;
    }
    setShowAddressModal(true);
    setSelectedItem(null);
  };

  const handleBuyNow = async (item) => {
    const userData = JSON.parse(localStorage.getItem("userdata"));
    if (!userData || !userData._id) {
      alert("Please log in first");
      return;
    }
    setSelectedItem(item);
    setShowAddressModal(true); 
  };

  const handleAddressConfirm = () => {
    if (!address || address.trim() === "") {
      alert("Please add your address before proceeding");
      setEditAddress(true);
      return;
    }
    setShowAddressModal(false);
    setShowPaymentModal(true);
  };

  const handleAddressEdit = async () => {
    const userData = JSON.parse(localStorage.getItem("userdata"));
    if (!userData || !userData._id) {
      alert("Please log in first");
      return;
    }

    try {
      const response = await axios.put(`http://localhost:8080/user/update-address/${userData._id}`, {
        address: address,
      });

      if (response.data) {
        localStorage.setItem("userdata", JSON.stringify({ ...userData, address: address }));
        alert("Address updated successfully!");
        setEditAddress(false);
      }
    } catch (error) {
      console.error("Error updating address:", error);
      alert("Failed to update address!");
    }
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

  const handleCashOnDelivery = async (selectedItem) => {
    const userData = JSON.parse(localStorage.getItem("userdata"));
    
    if (!userData || !userData._id) {
      alert("Please log in first");
      return;
    }

    try {
      const totalAmount = selectedItem
        ? selectedItem.product.productPrice * selectedItem.quantity + 40
        : calculateTotalAmount();

      const orderPayload = {
        productDetails: selectedItem
          ? [
              {
                name: selectedItem.product.productName,
                price: selectedItem.product.productPrice,
                quantity: selectedItem.quantity,
                image: [selectedItem.product.productImage],
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
          paymentId: `COD-${Date.now()}`,
          payment_method_type: ["COD"],
          payment_status: "cash",
        },
        shippingOptions: [
          {
            shipping_amount: 4000, 
            shipping_rate: "shr_1QxTpj4UOuOwfYxghjdIwZcb",
          },
        ],
        totalAmount: totalAmount,
      };

      const response = await axios.post(
        "http://localhost:8080/order/create-order",
        orderPayload
      );

      if (response.data.message === "Order created successfully") {
        if (selectedItem) {
          try {
            const stockResponse = await axios.put(
              `http://localhost:8080/products/update-stock/${selectedItem.product._id}`,
              { quantity: selectedItem.quantity }
            );
            console.log("Stock update response:", stockResponse.data);
          } catch (error) {
            console.error("Error updating stock:", error);
          }
        } else {
          for (const item of cartItems) {
            try {
              const stockResponse = await axios.put(
                `http://localhost:8080/products/update-stock/${item.product._id}`,
                { quantity: item.quantity }
              );
              console.log("Stock update response:", stockResponse.data);
            } catch (error) {
              console.error("Error updating stock:", error);
            }
          }
        }

        if (!selectedItem) {
          try {
            await axios.delete(`http://localhost:8080/cart/clear/${userData._id}`);
            setCartItems([]);
          } catch (error) {
            console.error("Error clearing cart:", error);
          }
        }

        navigate("/success", {
          state: {
            message: "Your Cash on Delivery order has been placed successfully!",
            orderDetails: response.data.order,
          },
        });
      } else {
        throw new Error("Failed to create order");
      }
    } catch (error) {
      console.error("Error during COD order:", error);
      alert("Failed to place COD order. Please try again.");
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
              <table className="cart-summary-table">
                <tr>
                  <th className="cart-summary-heading">Delivery Address</th>
                </tr>
                <tr>
                  <td colSpan="2" className="cart-summary-address">{address || <span>Address yet to be added !</span>}</td>
                </tr>
              </table>
            </div>
          )}
        </div>
      )}

      {showAddressModal && (
        <div className="address-modal-overlay">
          <div className="address-modal">
            <h2>Verify Your Address</h2>
            {editAddress ? (
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter your address" />
            ) : (
              <p>{address || <span>Address yet to be added !</span>}</p>
            )}
            <div className="address-modal-buttons">
              <button onClick={() => setEditAddress(!editAddress)} className="edit-cancel">
                {!editAddress && <FontAwesomeIcon icon={faEdit} className="edit-icon" />}
                <p>{editAddress ? "Cancel" : "Edit"}</p>
              </button>
              <button onClick={editAddress ? handleAddressEdit : handleAddressConfirm} className="edit-cancel">
                <p>{editAddress ? "Save" : "OK"}</p>
              </button>
            </div>
            <button onClick={() => setShowAddressModal(false)} className="button-close">Close</button>
          </div>
        </div>
      )}

      {showPaymentModal && (
        <div className="payment-modal-overlay">
          <div className="payment-modal">
            <h2>Select Payment Method</h2>
            <button onClick={() => handlePaymentMethodSelect("card")}>
              <FontAwesomeIcon icon={faCreditCard} className="credit-icon" />
              Debit/Credit Card
            </button>
            <button onClick={() => handlePaymentMethodSelect("upi")}>
              <FontAwesomeIcon icon={faMobileAlt} className="upi-icon" />
              UPI Payment
            </button>
            <button onClick={() => handlePaymentMethodSelect("cod")}>
              <FontAwesomeIcon icon={faMoneyBillAlt} className="cash-icon" />
              Cash on Delivery
            </button>
            <button onClick={() => setShowPaymentModal(false)}>Close</button>
          </div>
        </div>
      )}
    </>
  );
}

export default Cart;