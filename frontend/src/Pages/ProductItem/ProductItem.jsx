import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faCartShopping,
  faCartArrowDown,
  faCreditCard,
  faMobileAlt,
  faMoneyBillAlt,
  faEdit,
} from "@fortawesome/free-solid-svg-icons";
import Loading_Animation from "../Animation/Loading_Animation";
import "./ProductItem.css";
import axios from "axios";

function ProductItem() {
  const location = useLocation();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [randomProducts, setRandomProducts] = useState([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showOutOfStockModal, setShowOutOfStockModal] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [address, setAddress] = useState("");
  const [editAddress, setEditAddress] = useState(false);
  const product = location.state;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:8080/products/display-product-data");
        const data = await response.json();

        const allProducts = data.products || data;
        setProducts(allProducts);

        const similar = allProducts
          .filter((p) => p._id !== product._id && p.productCategory === product.productCategory)
          .sort(() => 0.5 - Math.random())
          .slice(0, 5);

        setRandomProducts(similar);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setTimeout(() => setLoading(false), 300);
      }
    };

    fetchProducts();
  }, [product]);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userdata"));
    if (userData && userData.address) {
      setAddress(userData.address);
    }
  }, []);

  const calculateOffer = (previousPrice, currentPrice) => {
    if (previousPrice && previousPrice > currentPrice) {
      const discount = Math.round(((previousPrice - currentPrice) / previousPrice) * 100);
      return `${discount}% off`;
    }
    return null;
  };

  const handleBackClick = () => navigate("/product");

  const handleBuyNow = () => {
    const userData = JSON.parse(localStorage.getItem("userdata"));
    if (!userData || !userData._id) {
      alert("Please log in first");
      return;
    }

    if (product.productStock === 0) {
      setShowOutOfStockModal(true);
    } else {
      setShowAddressModal(true);
    }
  };

  const handleAddressConfirm = () => {
    if (!address || address.trim() === "") {
      alert("Please add your delivery address before proceeding to payment");
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
      handleCardPayment();
    } else if (method === "upi") {
      navigate("/google-payment", { state: { product } });
    } else if (method === "cod") {
      handleCashOnDelivery();
    }
  };

  const handleCardPayment = async () => {
    const userData = JSON.parse(localStorage.getItem("userdata"));

    const payload = {
      cartItems: [
        {
          product: product._id,
          name: product.productName,
          images: [product.productImage],
          price: product.productPrice,
          quantity: 1,
        },
      ],
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

  const handleCashOnDelivery = async () => {
    const userData = JSON.parse(localStorage.getItem("userdata"));
    
    if (!userData || !userData._id) {
      alert("Please log in first");
      return;
    }

    try {
      const totalAmount = product.productPrice + 40;

      const orderPayload = {
        productDetails: [
          {
            name: product.productName,
            price: product.productPrice,
            quantity: 1,
            image: [product.productImage],
          },
        ],
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
        try {
          const stockResponse = await axios.put(
            `http://localhost:8080/products/update-stock/${product._id}`,
            { quantity: 1 }
          );
          console.log("Stock update response:", stockResponse.data);
        } catch (error) {
          console.error("Error updating stock:", error);
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

  const handleCardClick = (product) => navigate(`/product/${product._id}`, { state: product });

  const handleAddToCart = async () => {
    if (product.productStock === 0) {
      setShowOutOfStockModal(true);
      return;
    }

    const userData = JSON.parse(localStorage.getItem("userdata"));
    if (!userData || !userData._id) {
      alert("Please log in first");
      return;
    }

    try {
      const { data: existingCart } = await axios.get(`http://localhost:8080/cart?userId=${userData._id}`);
      const cartProducts = existingCart.products || [];

      const productExists = cartProducts.some(
        (cartItem) => cartItem.product.toString() === product._id.toString()
      );

      if (productExists) {
        alert("Product already added to the cart!");
        return;
      }

      const newCartItem = {
        product: product._id,
        productName: product.productName,
        productImage: product.productImage,
        productPrice: product.productPrice,
        productUnit: product.productUnit,
        quantity: 1,
      };

      await axios.post("http://localhost:8080/cart/add", {
        userId: userData._id,
        products: [newCartItem],
      });

      alert("Product added to cart successfully!");
    } catch (error) {
      alert("Failed to add product to cart!");
      console.error("Add to cart error:", error);
    }
  };

  if (!product) return <p>Product not found!</p>;

  return (
    <div>
      <Navbar />
      {loading ? (
        <div className="loading-wrapper">
          <Loading_Animation />
        </div>
      ) : (
        <div className="product-item-container">
          <button className="back-button" onClick={handleBackClick}>
            <FontAwesomeIcon icon={faArrowLeft} className="faArrowLeft" />
          </button>

          <div className="product-item-main">
            <div className="product-item-left">
              <img src={product.productImage} alt={product.productName} className="product-item-image" />
              <div className="product-item-button">
                <button onClick={handleAddToCart}>
                  <FontAwesomeIcon icon={faCartShopping} className="product-item-button-icon" />
                  ADD TO CART
                </button>
                <button onClick={handleBuyNow}>
                  <FontAwesomeIcon icon={faCartArrowDown} className="product-item-button-icon" />
                  BUY NOW
                </button>
              </div>
            </div>

            <div className="product-item-details">
              <h1>{product.productName}</h1>
              <p>Units: {product.productUnit}</p>
              <div className="product-item-details-a">
                <p className="product-item-price">₹{product.productPrice}</p>
                {product.productPreviousPrice && (
                  <p className="product-item-previous-price">
                    <strike>{product.productPreviousPrice}</strike>
                  </p>
                )}
                {product.productPreviousPrice && product.productPreviousPrice > product.productPrice && (
                  <p className="product-item-offer">
                    {calculateOffer(product.productPreviousPrice, product.productPrice)}
                  </p>
                )}
              </div>
              <p className={`product-stock ${product.productStock === 0 || product.productStock < 10 ? "low-stock" : ""}`}>
                {product.productStock === 0
                  ? "Out of Stock!"
                  : product.productStock < 10
                  ? `Only ${product.productStock} left!`
                  : `In Stock: ${product.productStock}`}
              </p>
              <div>
                <h2>Product Description</h2>
                <table>
                  <tbody>
                    <tr>
                      <td className="a">Category</td>
                      <td>{product.productCategory}</td>
                    </tr>
                    <tr>
                      <td className="a">Type</td>
                      <td>{product.productType}</td>
                    </tr>
                    <tr>
                      <td className="a">Brand</td>
                      <td>{product.productBrand}</td>
                    </tr>
                    <tr>
                      <td className="a">Quantity</td>
                      <td>{product.productUnit}</td>
                    </tr>
                    <tr>
                      <td className="a">Container Type</td>
                      <td>{product.productContainerType}</td>
                    </tr>
                    <tr>
                      <td className="a">Expiration Period</td>
                      <td>{product.productExpirationPeriod}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="product-item-random">
            <h2>Similar Products</h2>
            {randomProducts.length > 0 ? (
              <div className="product-item-grid">
                {randomProducts.map((randomProduct) => (
                  <div
                    className="product-item-card"
                    key={randomProduct._id}
                    onClick={() => handleCardClick(randomProduct)}
                  >
                    <img
                      src={randomProduct.productImage}
                      alt={randomProduct.productName}
                      className="product-image"
                    />
                    <div className="product-details">
                      <h3>{randomProduct.productName}</h3>
                      <p>Units: {randomProduct.productUnit}</p>
                      <div className="product-details-a">
                        <p className="product-item-price">Price: ₹{randomProduct.productPrice}</p>
                        {randomProduct.productPreviousPrice && (
                          <p className="product-item-previous-price">
                            <strike>{randomProduct.productPreviousPrice}</strike>
                          </p>
                        )}
                        {randomProduct.productPreviousPrice && randomProduct.productPreviousPrice > randomProduct.productPrice && (
                          <p className="product-item-offer">
                            {calculateOffer(randomProduct.productPreviousPrice, randomProduct.productPrice)}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>No similar products found.</p>
            )}
          </div>
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
                placeholder="Enter your delivery address"
              />
            ) : (
              <p>{address || <span>Please add your delivery address</span>}</p>
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

      {showOutOfStockModal && (
        <div className="out-of-stock-modal-overlay">
          <div className="out-of-stock-modal">
            <h2>Out of Stock</h2>
            <p>Sorry for the Inconvenience!</p>
            <button onClick={() => setShowOutOfStockModal(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductItem;