import React, { useState, useEffect } from "react";
import Navbar from "../Navbar/Navbar";
import "./Product.css";

function Product() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:8080/products");
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div>
      <Navbar />
      <div className="product-container">
        <h1>Available Products</h1>
        <div className="product-grid">
          {products.length > 0 ? (
            products.map((product) => (
              <div className="product-card" key={product._id}>
                <img
                  src={product.productImage}
                  alt={product.productName}
                  className="product-image"
                />
                <div className="product-details">
                  <h2>{product.productName}</h2>
                  <h3>{product.productTitle}</h3>
                  <p>Category: {product.productCategory}</p>
                  <p>Units : {product.productUnit}</p>
                  <p className="product-price">
                    Price : ₹ {product.productPrice}
                  </p>
                  <p className="product-stock">
                    In Stock: {product.productStock}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p>No products available.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Product;
