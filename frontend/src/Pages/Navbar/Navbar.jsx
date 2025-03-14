import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faCartShopping,
  faPenToSquare,
  faCircleQuestion,
  faRightFromBracket,
  faRightToBracket,
  faGauge,
} from "@fortawesome/free-solid-svg-icons";
import { auth, signOut } from "../../Auth/Firebase";
import axios from "axios";
import "./Navbar.css";
import ms_logo from "../../assets/maniyan_stores.png";
import Default_Image from "../../assets/default-profile.png";

function Navbar() {
  const [isProfileDropdownVisible, setIsProfileDropdownVisible] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [cartCount, setCartCount] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const storedData = localStorage.getItem("userdata");
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        if (parsedData?._id) {
          try {
            const response = await axios.get(`http://localhost:8080/user/get-user/${parsedData._id}`);
            setUserData(response.data);
          } catch (error) {
            console.error("Error fetching user data:", error);
          }
        }
      }
      setLoading(false);
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchCartCount = async () => {
      if (userData && userData._id) {
        try {
          const { data } = await axios.get(`http://localhost:8080/cart?userId=${userData._id}`);
          setCartCount(data.length);
        } catch (error) {
          console.error("Error fetching cart count:", error);
        }
      }
    };

    fetchCartCount();
    window.addEventListener("focus", fetchCartCount);
    return () => window.removeEventListener("focus", fetchCartCount);
  }, [userData]);

  const handleProfileClick = () => {
    setIsProfileDropdownVisible(!isProfileDropdownVisible);
  };

  const handleSigninClick = () => {
    navigate("/signin");
  };

  const handleCartClick = () => {
    if (!userData) {
      alert("Please log in first");
      return;
    }
    navigate("/cart");
  };

  const handleSignoutClick = () => {
    signOut(auth)
      .then(() => {
        localStorage.clear();
        setUserData(null);
        setIsProfileDropdownVisible(false);
        navigate("/signin");
      })
      .catch((error) => {
        console.error("Sign-out error:", error);
      });
  };

  const handleEditProfileClick = () => {
    navigate("/editprofile");
  };

  const handleAdminDashboardClick = () => {
    navigate("/admin");
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    navigate(`/product?search=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <>
      <div className="Navbar">
        <img src={ms_logo} alt="Logo" className="ms-logo" />
        <div className="Nav-Links">
          <ul>
            <li>
              <NavLink className="Navlink" to="/">Home</NavLink>
            </li>
            <li>
              <NavLink className="Navlink" to="/product">Products</NavLink>
            </li>
            <li>
              <NavLink
                className="Navlink"
                to="/order"
                onClick={(e) => {
                  if (!userData) {
                    e.preventDefault();
                    alert("Please log in first");
                  }
                }}
              >
                Orders
              </NavLink>
            </li>
            <li>
              <NavLink className="Navlink" to="/contact">Contact</NavLink>
            </li>
          </ul>
        </div>
        <div className="search_container">
          <form onSubmit={handleSearchSubmit}>
            <input type="text" placeholder="Search for Products..." value={searchQuery} onChange={handleSearchChange} />
            <FontAwesomeIcon icon={faSearch} className="search_icon" />
          </form>
        </div>
        <div className="Nav-log">
          <div className="cart-icon-container">
            {cartCount > 0 && <p>{cartCount}</p>}
            <FontAwesomeIcon icon={faCartShopping} className="cart-icon" onClick={handleCartClick} />
          </div>
          <img
            src={userData?.image || Default_Image}
            alt="Profile"
            className="profile"
            onClick={handleProfileClick}
            onError={(e) => {
              console.error("Error loading profile picture. Falling back to default.");
              e.target.src = Default_Image;
            }}
          />
        </div>
        {isProfileDropdownVisible && (
          <div className="dropdown-profile">
            {userData ? (
              <>
                <div className="username-container">
                  <h2>{userData.name}</h2>
                </div>
                <hr />
                <ul>
                  <li onClick={handleEditProfileClick}>
                    <FontAwesomeIcon icon={faPenToSquare} className="dd-icon" /> Edit Profile
                  </li>
                  {userData?.isAdmin && (
                    <li onClick={handleAdminDashboardClick}>
                      <FontAwesomeIcon icon={faGauge} className="dd-icon" /> Admin Dashboard
                    </li>
                  )}
                  <li>
                    <FontAwesomeIcon icon={faCircleQuestion} className="dd-icon" /> Help & Support
                  </li>
                  <li onClick={handleSignoutClick} className="signout-item">
                    <FontAwesomeIcon icon={faRightFromBracket} className="dd-icon" /> Sign out
                  </li>
                </ul>
              </>
            ) : (
              <ul>
                <li onClick={handleSigninClick} className="signin-item">
                  <FontAwesomeIcon icon={faRightToBracket} className="db-icon" /> Sign in
                </li>
              </ul>
            )}
          </div>
        )}
      </div>
      {!loading && !userData && !isProfileDropdownVisible && (
        <div className="login-float-container">
          <div className="login-float" onClick={handleProfileClick}>
            <p>Login</p>
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;