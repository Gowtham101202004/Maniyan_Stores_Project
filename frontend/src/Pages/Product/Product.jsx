import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter, faTimes } from "@fortawesome/free-solid-svg-icons";
import Loading_Animation from "../Animation/Loading_Animation";
import "./Product.css";

function Product() {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();

  // State for filters
  const [selectedCategory, setSelectedCategory] = useState(
    localStorage.getItem("selectedCategory") || "All"
  );
  const [selectedType, setSelectedType] = useState(
    localStorage.getItem("selectedType") || "All"
  );
  const [selectedPriceRange, setSelectedPriceRange] = useState(
    localStorage.getItem("selectedPriceRange") || "All"
  );
  const [selectedBrand, setSelectedBrand] = useState(
    localStorage.getItem("selectedBrand") || "All"
  );

  const categoryOptions = ["All", "Food Products", "Dairy Products", "Beverages", "Fruits and Vegetables", "Bread and Desserts", "Cleaning Supplies"];
  const typeOptions = ["All", "Organic", "Non-Organic", "Packaged", "Fresh"];
  const priceRangeOptions = ["All", "0 - 100", "101 - 500", "501 - 1000", "1000+"];
  const brandOptions = ["All", "Brand A", "Brand B", "Brand C", "Brand D"];

  useEffect(() => {
    localStorage.setItem("selectedCategory", selectedCategory);
    localStorage.setItem("selectedType", selectedType);
    localStorage.setItem("selectedPriceRange", selectedPriceRange);
    localStorage.setItem("selectedBrand", selectedBrand);
  }, [selectedCategory, selectedType, selectedPriceRange, selectedBrand]);

  const handleCategoryChange = (event) => setSelectedCategory(event.target.value);
  const handleTypeChange = (event) => setSelectedType(event.target.value);
  const handlePriceRangeChange = (event) => setSelectedPriceRange(event.target.value);
  const handleBrandChange = (event) => setSelectedBrand(event.target.value);

  const clearAllFilters = () => {
    setSelectedCategory("All");
    setSelectedType("All");
    setSelectedPriceRange("All");
    setSelectedBrand("All");
  };

  const removeFilter = (filterType) => {
    switch (filterType) {
      case "category":
        setSelectedCategory("All");
        break;
      case "type":
        setSelectedType("All");
        break;
      case "priceRange":
        setSelectedPriceRange("All");
        break;
      case "brand":
        setSelectedBrand("All");
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    let isMounted = true;
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await fetch("http://localhost:8080/products/display-product-data");
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
  }, [location.search]);

  useEffect(() => {
    setLoading(true);

    const filtered = products.filter((product) => {
      const matchesSearchQuery =
        !searchQuery || product.productName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "All" || product.productCategory === selectedCategory;
      const matchesType = selectedType === "All" || product.productType === selectedType;
      const matchesPriceRange =
        selectedPriceRange === "All" ||
        (selectedPriceRange === "0 - 100" && product.productPrice <= 100) ||
        (selectedPriceRange === "101 - 500" && product.productPrice > 100 && product.productPrice <= 500) ||
        (selectedPriceRange === "501 - 1000" && product.productPrice > 500 && product.productPrice <= 1000) ||
        (selectedPriceRange === "1000+" && product.productPrice > 1000);
      const matchesBrand = selectedBrand === "All" || product.productBrand === selectedBrand;

      return matchesSearchQuery && matchesCategory && matchesType && matchesPriceRange && matchesBrand;
    });

    setFilteredProducts(filtered);
    setTimeout(() => setLoading(false), 300);
  }, [products, searchQuery, selectedCategory, selectedType, selectedPriceRange, selectedBrand]);

  const handleCardClick = (product) => {
    navigate(`/product/${product._id}`, { state: product });
  };

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

            {/* Selected Filters */}
            <div className="selected-filters">
              {selectedCategory !== "All" && (
                <span className="filter-tag">
                  {selectedCategory} <FontAwesomeIcon icon={faTimes} onClick={() => removeFilter("category")} className="filter-tag-icon" />
                </span>
              )}
              {selectedType !== "All" && (
                <span className="filter-tag">
                  {selectedType} <FontAwesomeIcon icon={faTimes} onClick={() => removeFilter("type")} className="filter-tag-icon"/>
                </span>
              )}
              {selectedPriceRange !== "All" && (
                <span className="filter-tag">
                  {selectedPriceRange} <FontAwesomeIcon icon={faTimes} onClick={() => removeFilter("priceRange")} className="filter-tag-icon"/>
                </span>
              )}
              {selectedBrand !== "All" && (
                <span className="filter-tag">
                  {selectedBrand} <FontAwesomeIcon icon={faTimes} onClick={() => removeFilter("brand")} className="filter-tag-icon"/>
                </span>
              )}
            </div>

            {([selectedCategory, selectedType, selectedPriceRange, selectedBrand].some(filter => filter !== "All")) && (
              <button className="clear-all-btn" onClick={clearAllFilters}>Clear All</button>
            )}

            <div>
              <label className="filter-select-label" htmlFor="category-select">CATEGORIES</label>
              <select id="category-select" value={selectedCategory} onChange={handleCategoryChange} className="filter-select">
                {categoryOptions.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="filter-select-label" htmlFor="type-select">TYPE</label>
              <select id="type-select" value={selectedType} onChange={handleTypeChange} className="filter-select">
                {typeOptions.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="filter-select-label" htmlFor="price-range-select">PRICE RANGE</label>
              <select id="price-range-select" value={selectedPriceRange} onChange={handlePriceRangeChange} className="filter-select">
                {priceRangeOptions.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="filter-select-label" htmlFor="brand-select">BRAND</label>
              <select id="brand-select" value={selectedBrand} onChange={handleBrandChange} className="filter-select">
                {brandOptions.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="product-grid">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <div
                  className="product-card"
                  key={product._id}
                  onClick={() => handleCardClick(product)} 
                >
                  <img src={product.productImage} alt={product.productName} className="product-image" />
                  <div className="product-details">
                    <h3>{product.productName}</h3>
                    <p>Units: {product.productUnit}</p>
                    <p className="product-price">Price: ₹ {product.productPrice}</p>
                    <p className="product-stock">In Stock: {product.productStock}</p>
                  </div>
                </div>
              ))
            ) : (
              !loading &&
              <div className="no-product">
                <img src="https://img.freepik.com/premium-vector/vector-illustration-about-concept-no-items-found-no-results-found_675567-6604.jpg?w=740" />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Product;
