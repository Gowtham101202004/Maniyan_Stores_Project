import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faCartShopping, faPenToSquare, faCircleQuestion, faRightFromBracket, faRightToBracket } from "@fortawesome/free-solid-svg-icons";
import { auth, onAuthStateChanged, signOut } from "../../Auth/Firebase";
import "./Navbar.css";
import ms_logo from "../../assets/maniyan_stores.png";
import Default_Image from "../../assets/default-profile.png";

function Navbar() {
  const [isProfileDropdownVisible, setIsProfileDropdownVisible] = useState(false);
  const [username, setUsername] = useState("Guest");
  const [profilePicture, setProfilePicture] = useState(Default_Image);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUsername(user.displayName || "User");
        setProfilePicture(user.photoURL);
      } else {
        setUsername("Guest");
        setProfilePicture(Default_Image);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleProfileClick = () => {
    setIsProfileDropdownVisible(!isProfileDropdownVisible);
  };

  const handleSigninClick = () => {
    navigate("/signin");
  };

  const handleSignoutClick = () => {
    signOut(auth)
      .then(() => {
        localStorage.clear();
        setUsername("Guest");
        setProfilePicture(Default_Image); 
        setIsProfileDropdownVisible(false);
        navigate("/signin");
      })
      .catch((error) => {
        console.error("Sign-out error:", error);
      });
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
              <NavLink className="Navlink" to="/contact">Contact</NavLink>
            </li>
            <li>
              <NavLink className="Navlink" to="/about">About</NavLink>
            </li>
          </ul>
        </div>
        <div className="search_container">
          <input type="text" placeholder="Search" />
          <FontAwesomeIcon icon={faSearch} className="search_icon" />
        </div>
        <div className="Nav-log">
          <FontAwesomeIcon icon={faCartShopping} className="cart-icon" />
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
        {/* Profile Dropdown start*/}
        {isProfileDropdownVisible && (
          <div className="dropdown-profile">
            {JSON.parse(localStorage.getItem("userStatus")) ? (
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
        {/* Profile Dropdown end*/}
      </div>
    </>
  );
}

export default Navbar;
