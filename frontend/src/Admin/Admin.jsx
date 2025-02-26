import React, { useState, useEffect } from 'react';
import './Admin.css';
import { useNavigate } from "react-router-dom";
import Default_Profile from "../assets/default-profile.png";
import { FaTachometerAlt, FaUsers, FaBoxOpen, FaShoppingCart, FaSignOutAlt, FaHome, FaMoneyBillWave } from 'react-icons/fa';

function Admin() {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [dashboardData, setDashboardData] = useState({ users: 0, products: 0, orders: 0, revenue: 0 });
  const [adminData, setAdminData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
    fetchAdminData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch("http://localhost:8080/admin/count", {
        headers: { "Content-Type": "application/json" }
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const { data } = await response.json(); 
      setDashboardData({
        userCount: data.userCount || 0,
        productCount: data.productCount || 0
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error.message);
    }
  };

  const fetchAdminData = async () => {
    const storedData = localStorage.getItem("userdata");
    if (storedData) {
      setAdminData(JSON.parse(storedData));
    }
  };

  const handleHomeClick = () => {
    navigate("/");
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <div className="admin-main">
            <h1>Admin Dashboard</h1>
            <div className="dashboard-cards">
              <div className="card" style={{ backgroundColor: 'rgb(236, 128, 33)' }}>
                <FaUsers className="card-icon" />
                <h3>USERS</h3>
                <p>{dashboardData.userCount}</p>
              </div>
              <div className="card" style={{ backgroundColor: 'rgb(24, 34, 227)' }}>
                <FaBoxOpen className="card-icon" />
                <h3>PRODUCTS</h3>
                <p>{dashboardData.productCount}</p>
              </div>
              <div className="card" style={{ backgroundColor: 'rgb(20, 198, 144)' }}>
                <FaShoppingCart className="card-icon" />
                <h3>ORDERS</h3>
                <p>70</p>
              </div>
              <div className="card" style={{ backgroundColor: 'rgb(185, 14, 28)' }}>
                <FaMoneyBillWave className="card-icon" />
                <h3>REVENUE</h3>
                <p>₹ 15000</p>
              </div>
            </div>
          </div>
        );
      case 'users':
        return (
          <div className="users">
            <h1>Users Section</h1>
          </div>
        );
      case 'products':
        return (
          <div className="products">
            <h1>Products Section</h1>
          </div>
        );
      case 'orders':
        return (
          <div className="orders">
            <h1>Orders Section</h1>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="admin-container">
      <div className="admin-navbar">
        <div className="admin-profile">
          <img
            src={adminData?.image || Default_Profile}
            alt="Admin Profile"
            onError={(e) => {
              console.error("Error loading admin profile picture. Falling back to default.");
              e.target.src = Default_Profile;
            }}/>
          <h2>{adminData?.name || "Admin"}</h2>
        </div>
        <hr />
        <ul>
          <li onClick={() => setActiveSection('dashboard')} className={activeSection === 'dashboard' ? 'active' : ''}>
            <FaTachometerAlt className="icon" />DASHBOARD
          </li>
          <li onClick={() => setActiveSection('users')} className={activeSection === 'users' ? 'active' : ''}>
            <FaUsers className="icon" />USERS
          </li>
          <li onClick={() => setActiveSection('products')} className={activeSection === 'products' ? 'active' : ''}>
            <FaBoxOpen className="icon" />PRODUCTS
          </li>
          <li onClick={() => setActiveSection('orders')} className={activeSection === 'orders' ? 'active' : ''}>
            <FaShoppingCart className="icon" />ORDERS
          </li>
          <hr />
          <li onClick={handleHomeClick}><FaHome className="icon" />HOME</li>
          <li className="logout"><FaSignOutAlt className="icon" /> LOGOUT</li>
        </ul>
      </div>
      {renderSection()}
    </div>
  );
}

export default Admin;