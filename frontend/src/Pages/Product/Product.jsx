import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter } from "@fortawesome/free-solid-svg-icons";
import Loading_Animation from "../Animation/Loading_Animation";
import "./Product.css";

function Product() {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [typingTimeout, setTypingTimeout] = useState(null);

  const location = useLocation();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState([]);

  const options = ["Option 1", "Option 2", "Option 3"];

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleCheckboxChange = (option) => {
    setSelectedOptions((prev) =>
      prev.includes(option) ? prev.filter((item) => item !== option) : [...prev, option]
    );
  };

  const handleSelectAllChange = () => {
    if (selectedOptions.length === options.length) {
      setSelectedOptions([]); // Deselect all
    } else {
      setSelectedOptions(options); // Select all
    }
  };

  useEffect(() => {
    let isMounted = true;
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await fetch("http://localhost:8080/products");
        const data = await response.json();
        if (isMounted) {
          setProducts(data);
          setFilteredProducts(data);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        if (isMounted) {
          setTimeout(() => setLoading(false), 300);
        }
      }
    };
    fetchProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get("search") || "";

    setSearchQuery(query);

    setLoading(true);

    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    const timeout = setTimeout(() => {
      const filtered = products.filter(
        (product) =>
          product.productTitle.toLowerCase().includes(query.toLowerCase()) ||
          product.productName.toLowerCase().includes(query.toLowerCase()) ||
          product.productCategory.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredProducts(filtered);
      setTimeout(() => setLoading(false), 300);
    }, 300);

    setTypingTimeout(timeout);

    return () => clearTimeout(typingTimeout);
  }, [location.search, products]);

  return (
    <div>
      <Navbar />
      {loading ? (
        <div className="loading-wrapper">
          <Loading_Animation />
        </div>
      ) : (
        <div className="product-container">
          <div className="filter-container">
            <div className="filter">
              <FontAwesomeIcon icon={faFilter} className="filter-icon" />
              <p>Filters</p>
            </div>
            <hr />
            <div>
              <div className="filter-select-options" >
                Categories
                <span className={`arrow ${isDropdownOpen ? "rotate-down" : ""}`} onClick={toggleDropdown}>&gt;</span>
              </div>
              {/* <button >Select Options</button> */}
              {isDropdownOpen && (
                <div style={{ border: "1px solid #ccc", padding: "10px", marginTop: "5px" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "10px",
                      fontWeight: "bold",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={selectedOptions.length === options.length}
                      onChange={handleSelectAllChange}
                    />
                    Select All
                  </label>
                  {options.map((option) => (
                    <label key={option} style={{ display: "block", marginBottom: "5px" }}>
                      <input
                        type="checkbox"
                        checked={selectedOptions.includes(option)}
                        onChange={() => handleCheckboxChange(option)}
                      />
                      {option}
                    </label>
                  ))}
                </div>
              )}
              <p>Selected: {selectedOptions.join(", ") || "None"}</p>
            </div>
          </div>
          <div className="product-grid">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <div className="product-card" key={product._id}>
                  <img
                    src={product.productImage}
                    alt={product.productName}
                    className="product-image"
                  />
                  <div className="product-details">
                    <h2>{product.productTitle}</h2>
                    <h3>{product.productName}</h3>
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
              !loading && <p>No products available.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Product;
