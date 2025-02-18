import React, { useEffect, useState } from 'react';
import Navbar from './Navbar/Navbar';
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTruckFast, faLeaf, faCreditCard } from "@fortawesome/free-solid-svg-icons";
import './Home.css';
import Slider from './Slider/Slider';

function Home() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Function to navigate to ProductItem with product details
  const handleProductClick = (product) => {
    navigate(`/product/${product._id}`, { state: product });
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:8080/products/display-product-data");
        const data = await response.json();
        const allProducts = data.products || data; 

        const randomProducts = allProducts
          .sort(() => 0.5 - Math.random())
          .slice(0, 5);

        setProducts(randomProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setTimeout(() => setLoading(false), 300);
      }
    };

    fetchProducts();
  }, []);

  const calculateOffer = (previousPrice, currentPrice) => {
    if (previousPrice && previousPrice > currentPrice) {
      const discount = Math.round(((previousPrice - currentPrice) / previousPrice) * 100);
      return `${discount}% off`;
    }
    return null;
  };

  return (
    <div>
      <Navbar />
      <Slider />
      <div className="random-products">
        <h2>Featured Products</h2>
        {loading ? (
          <p>Loading products...</p>
        ) : (
          <div className="product-grid">
            {products.map((product) => (
              <div className="product-card" key={product._id}>
                <img
                  src={product.productImage}
                  alt={product.productName}
                  className="product-image"
                />
                <div className="product-details">
                  <h3>{product.productName}</h3>
                  <p>Units: {product.productUnit}</p>
                  <div className="product-details-a">
                    <p className="product-price">Price: ₹{product.productPrice}</p>
                    {product.productPreviousPrice && (
                      <p className="product-previous-price">
                        <strike>{product.productPreviousPrice}</strike>
                      </p>
                    )}
                    {product.productPreviousPrice && product.productPreviousPrice > product.productPrice && (
                      <p className="product-offer">
                        {calculateOffer(product.productPreviousPrice, product.productPrice)}
                      </p>
                    )}
                  </div>
                  <div className="product-buttons">
                    {/* Update button to pass product details */}
                    <button onClick={() => handleProductClick(product)}>VIEW PRODUCT</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="features-section">
        <div className="feature">
          <i className="feature-icon">
            <FontAwesomeIcon icon={faTruckFast} />
          </i>
          <h3>Fast Delivery</h3>
          <p>Get fresh groceries delivered to your home quickly and safely.</p>
        </div>
        <div className="feature">
          <i className="feature-icon">
            <FontAwesomeIcon icon={faLeaf} />
          </i>
          <h3>Fresh Produce</h3>
          <p>We offer only the freshest fruits, vegetables, and herbs.</p>
        </div>
        <div className="feature">
          <i className="feature-icon">
            <FontAwesomeIcon icon={faCreditCard} />
          </i>
          <h3>Secure Payment</h3>
          <p>Shop with confidence with our secure payment options.</p>
        </div>
      </div>
    </div>
  );
}

export default Home;
