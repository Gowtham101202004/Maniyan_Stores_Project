import React from 'react';
import './Admin.css';
import Default_Profile from "../assets/default-profile.png";
import { FaTachometerAlt, FaUsers, FaBoxOpen, FaShoppingCart, FaSignOutAlt, FaHome } from 'react-icons/fa';

function Admin() {
  return (
    <div className="admin-container">
      <div className="admin-navbar">
        <div className="admin-profile">
          <img src={Default_Profile} alt="Admin Profile" />
          <h2>GOWTHAM PRASATH</h2>
        </div>
        <hr />
        <ul>
          <li><FaTachometerAlt className="icon" />DASHBOARD</li>
          <li><FaUsers className="icon" />USERS</li>
          <li><FaBoxOpen className="icon" />PRODUCTS</li>
          <li><FaShoppingCart className="icon" />ORDERS</li>
          <hr/>
          <li><FaHome className="icon" />HOME</li>
          <li className="logout"><FaSignOutAlt className="icon" /> LOGOUT</li>
        </ul>
      </div>
      <div className="admin-main">

      </div>
    </div>
  );
}

export default Admin;
