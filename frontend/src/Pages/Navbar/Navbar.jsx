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
} from "@fortawesome/free-solid-svg-icons";
import { auth, onAuthStateChanged, signOut } from "../../Auth/Firebase";
import axios from "axios";
import "./Navbar.css";
import ms_logo from "../../assets/maniyan_stores.png";
import Default_Image from "../../assets/default-profile.png";

function Navbar() {
  const [isProfileDropdownVisible, setIsProfileDropdownVisible] = useState(false);
  const [username, setUsername] = useState("Guest");
  const [profilePicture, setProfilePicture] = useState(Default_Image);
  const [userStatus, setUserStatus] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [cartCount, setCartCount] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    const userStatusFromLocalStorage = localStorage.getItem("userStatus") === "true";

    if (userStatusFromLocalStorage) {
      const userData = JSON.parse(localStorage.getItem("userdata"));
      if (userData) {
        setUsername(userData.name || "User");
        setProfilePicture(userData.profilePicture || Default_Image);
        setUserStatus(true);
      }
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUsername(user.displayName || "User");
        setProfilePicture(user.photoURL || Default_Image);
        setUserStatus(true);
      } else if (!userStatusFromLocalStorage) {
        setUsername("Guest");
        setProfilePicture(Default_Image);
        setUserStatus(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchCartCount = async () => {
      const userData = JSON.parse(localStorage.getItem("userdata"));
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

    // Refetch cart count when navigating between pages
    window.addEventListener("focus", fetchCartCount);
    return () => window.removeEventListener("focus", fetchCartCount);
  }, []);

  const handleProfileClick = () => {
    setIsProfileDropdownVisible(!isProfileDropdownVisible);
  };

  const handleSigninClick = () => {
    navigate("/signin");
  };

  const handleCartClick = () => {
    navigate("/cart");
  };

  const handleSignoutClick = () => {
    signOut(auth)
      .then(() => {
        localStorage.clear();
        setProfilePicture(Default_Image);
        setUserStatus(false);
        setIsProfileDropdownVisible(false);
        navigate("/signin");
      })
      .catch((error) => {
        console.error("Sign-out error:", error);
      });
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
              <NavLink className="Navlink" to="/">
                Home
              </NavLink>
            </li>
            <li>
              <NavLink className="Navlink" to="/product">
                Products
              </NavLink>
            </li>
            <li>
              <NavLink className="Navlink" to="/contact">
                Contact
              </NavLink>
            </li>
            <li>
              <NavLink className="Navlink" to="/about">
                About
              </NavLink>
            </li>
          </ul>
        </div>
        <div className="search_container">
          <form onSubmit={handleSearchSubmit}>
            <input
              type="text"
              placeholder="Search for Products. . ."
              value={searchQuery}
              onChange={handleSearchChange}
            />
            <FontAwesomeIcon icon={faSearch} className="search_icon" />
          </form>
        </div>
        <div className="Nav-log">
          <div className="cart-icon-container">
            {cartCount > 0 && <p>{cartCount}</p>}
            <FontAwesomeIcon icon={faCartShopping} className="cart-icon" onClick={handleCartClick} />
          </div>
          <img
            src={profilePicture}
            alt="Profile"
            className="profile"
            onClick={handleProfileClick}
            onError={(e) => {
              console.error(
                `Error loading profile picture. Falling back to default. URL: ${profilePicture}`
              );
              e.target.src = Default_Image;
              setProfilePicture(Default_Image);
            }}
          />
        </div>
        {isProfileDropdownVisible && (
          <div className="dropdown-profile">
            {userStatus ? (
              <>
                <div className="username-container">
                  <h2>{username}</h2>
                </div>
                <hr />
                <ul>
                  <li>
                    <FontAwesomeIcon icon={faPenToSquare} className="dd-icon" />
                    Edit Profile
                  </li>
                  <li>
                    <FontAwesomeIcon icon={faCircleQuestion} className="dd-icon" />
                    Help & Support
                  </li>
                  <li onClick={handleSignoutClick} className="signout-item">
                    <FontAwesomeIcon icon={faRightFromBracket} className="dd-icon" />
                    <span>Sign out</span>
                  </li>
                </ul>
              </>
            ) : (
              <ul>
                <li onClick={handleSigninClick} className="signin-item">
                  <FontAwesomeIcon icon={faRightToBracket} className="dd-icon" />
                  <span>Sign in</span>
                </li>
              </ul>
            )}
          </div>
        )}
      </div>
      {!loading && !userStatus && !isProfileDropdownVisible && (
        <div className="login-float-container">
          <div className="login-float">
            <p>Login</p>
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;
