import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faCartShopping, faCartArrowDown } from "@fortawesome/free-solid-svg-icons";
import Loading_Animation from "../Animation/Loading_Animation";
import "./ProductItem.css";
import axios from "axios";

function ProductItem() {
  const location = useLocation();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [randomProducts, setRandomProducts] = useState([]);
  const product = location.state;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:8080/products/display-product-data");
        const data = await response.json();
        setProducts(data);
        setRandomProducts(data.sort(() => 0.5 - Math.random()).slice(0, 5));
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setTimeout(() => setLoading(false), 300);
      }
    };

    fetchProducts();
  }, []);

  const handleBackClick = () => navigate(-1);

  const handleCardClick = (product) => navigate(`/product/${product._id}`, { state: product });

  const handleAddToCart = async () => {
    const userData = JSON.parse(localStorage.getItem("userdata"));
    if (!userData || !userData._id) {
      alert("Please log in first");
      return;
    }
  
    try {
      await axios.post("http://localhost:8080/cart/add", {
        productName: product.productName,
        productImage: product.productImage,
        productPrice: product.productPrice,
        productUnit: product.productUnit,
        userId: userData._id
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
                <button>
                  <FontAwesomeIcon icon={faCartArrowDown} className="product-item-button-icon" />
                  BUY NOW
                </button>
              </div>
            </div>

            <div className="product-item-details">
              <h1>{product.productName}</h1>
              <p>Units: {product.productUnit}</p>
              <p className="product-item-price">₹ {product.productPrice}</p>
              <p>Stock: {product.productStock}</p>
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
                      <p className="product-item-price">Price: ₹{randomProduct.productPrice}</p>
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
    </div>
  );
}

export default ProductItem;
