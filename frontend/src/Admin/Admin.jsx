import React, { useState, useEffect } from 'react';
import './Admin.css';
import { useNavigate } from "react-router-dom";
import Default_Profile from "../assets/default-profile.png";
import { FaTachometerAlt, FaUsers, FaBoxOpen, FaShoppingCart, FaSignOutAlt, FaHome, FaMoneyBillWave, FaEdit, FaPen, FaTrash, FaPlus } from 'react-icons/fa';

function Admin() {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [dashboardData, setDashboardData] = useState({ users: 0, products: 0, orders: 0, revenue: 0 });
  const [adminData, setAdminData] = useState(null);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [editedUser, setEditedUser] = useState({});
  const [editingProduct, setEditingProduct] = useState(null);
  const [editedProduct, setEditedProduct] = useState({});
  const [newProduct, setNewProduct] = useState({
    productImage: '',
    productCategory: '',
    productType: '',
    productBrand: '',
    productName: '',
    productUnit: '',
    productContainerType: '',
    productExpirationPeriod: '',
    productPrice: '',
    productPreviousPrice: '',
    productStock: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
    fetchAdminData();
    fetchUserData();
    fetchProductData();
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

  const fetchUserData = async () => {
    try {
      const response = await fetch("http://localhost:8080/admin/users");
      if (!response.ok) throw new Error("Failed to fetch users");
      const { data } = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching user data:", error.message);
    }
  };

  const fetchProductData = async () => {
    try {
      const response = await fetch("http://localhost:8080/admin/products");
      if (!response.ok) throw new Error("Failed to fetch products");
      const { data } = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching product data:", error.message);
    }
  };

  const handleEditUser = (user) => {
    setEditingUser(user._id);
    setEditedUser({ ...user });
  };

  const handleSaveUser = async () => {
    try {
      await fetch(`http://localhost:8080/admin/users/${editingUser}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editedUser)
      });
      fetchUserData();
      setEditingUser(null);
    } catch (error) {
      console.error("Error updating user:", error.message);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await fetch(`http://localhost:8080/admin/users/${userId}`, { method: 'DELETE' });
      fetchUserData();
    } catch (error) {
      console.error("Error deleting user:", error.message);
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product._id);
    setEditedProduct({ ...product });
  };

  const handleSaveProduct = async () => {
    try {
      await fetch(`http://localhost:8080/admin/products/${editingProduct}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editedProduct)
      });
      fetchProductData();
      setEditingProduct(null);
    } catch (error) {
      console.error("Error updating product:", error.message);
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      await fetch(`http://localhost:8080/admin/products/${productId}`, { method: 'DELETE' });
      fetchProductData();
    } catch (error) {
      console.error("Error deleting product:", error.message);
    }
  };

  const handleAddProduct = async () => {
    try {
      await fetch("http://localhost:8080/admin/products", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProduct)
      });
      fetchProductData();
      setNewProduct({
        productImage: '',
        productCategory: '',
        productType: '',
        productBrand: '',
        productName: '',
        productUnit: '',
        productContainerType: '',
        productExpirationPeriod: '',
        productPrice: '',
        productPreviousPrice: '',
        productStock: ''
      });
    } catch (error) {
      console.error("Error adding product:", error.message);
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
                <div className="card-icon-container">
                  <FaUsers className="card-icon" />
                  <h3>USERS</h3>
                </div>
                <p>{dashboardData.userCount}</p>
              </div>
              <div className="card" style={{ backgroundColor: 'rgb(24, 34, 227)' }}>
                <div className="card-icon-container">
                  <FaBoxOpen className="card-icon" />
                  <h3>PRODUCTS</h3>
                </div>
                <p>{dashboardData.productCount}</p>
              </div>
              <div className="card" style={{ backgroundColor: 'rgb(20, 198, 144)' }}>
                <div className="card-icon-container">
                  <FaShoppingCart className="card-icon" />
                  <h3>ORDERS</h3>
                </div>
                <p>70</p>
              </div>
              <div className="card" style={{ backgroundColor: 'rgb(185, 14, 28)' }}>
                <div className="card-icon-container">
                  <FaMoneyBillWave className="card-icon" />
                  <h3>REVENUE</h3>
                </div>
                <p>₹ 15000</p>
              </div>
            </div>
          </div>
        );
      case 'users':
        return (
          <div className="users">
            <h1>Users</h1>
            <table className="user-table">
              <thead>
                <tr>
                  <th>Profile</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Address</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td>
                      <img src={user.image || Default_Profile} alt="User" className="user-profile" />
                    </td>
                    <td>
                      {editingUser === user._id ? (
                        <input type="text" value={editedUser.name} onChange={(e) => setEditedUser({ ...editedUser, name: e.target.value })} />
                      ) : (
                        user.name
                      )}
                    </td>
                    <td>{user.email}</td>
                    <td>{editingUser === user._id ? (
                      <input type="text" value={editedUser.phonenumber} onChange={(e) => setEditedUser({ ...editedUser, phonenumber: e.target.value })} />
                    ) : (
                      user.phonenumber || "N/A"
                    )}</td>
                    <td>{editingUser === user._id ? (
                      <input type="text" value={editedUser.address} onChange={(e) => setEditedUser({ ...editedUser, address: e.target.value })} />
                    ) : (
                      user.address || "N/A"
                    )}</td>
                    <td>
                      {editingUser === user._id ? (
                        <button onClick={handleSaveUser}>Save</button>
                      ) : (
                        <div className='user-icons'>
                          <FaPen className="edit-icon" onClick={() => handleEditUser(user)} />
                          <FaTrash className="delete-icon" onClick={() => handleDeleteUser(user._id)} />
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case 'products':
        return (
          <div className="products">
            <h1>Products</h1>
            <div className="add-product">
              <h2>Add New Product</h2>
              <div className="add-product-form">
                <input type="text" placeholder="Image URL" value={newProduct.productImage} onChange={(e) => setNewProduct({ ...newProduct, productImage: e.target.value })} />
                <input type="text" placeholder="Category" value={newProduct.productCategory} onChange={(e) => setNewProduct({ ...newProduct, productCategory: e.target.value })} />
                <input type="text" placeholder="Type" value={newProduct.productType} onChange={(e) => setNewProduct({ ...newProduct, productType: e.target.value })} />
                <input type="text" placeholder="Brand" value={newProduct.productBrand} onChange={(e) => setNewProduct({ ...newProduct, productBrand: e.target.value })} />
                <input type="text" placeholder="Name" value={newProduct.productName} onChange={(e) => setNewProduct({ ...newProduct, productName: e.target.value })} />
                <input type="text" placeholder="Unit" value={newProduct.productUnit} onChange={(e) => setNewProduct({ ...newProduct, productUnit: e.target.value })} />
                <input type="text" placeholder="Container Type" value={newProduct.productContainerType} onChange={(e) => setNewProduct({ ...newProduct, productContainerType: e.target.value })} />
                <input type="text" placeholder="Expiration Period" value={newProduct.productExpirationPeriod} onChange={(e) => setNewProduct({ ...newProduct, productExpirationPeriod: e.target.value })} />
                <input type="text" placeholder="Price" value={newProduct.productPrice} onChange={(e) => setNewProduct({ ...newProduct, productPrice: e.target.value })} />
                <input type="text" placeholder="Previous Price" value={newProduct.productPreviousPrice} onChange={(e) => setNewProduct({ ...newProduct, productPreviousPrice: e.target.value })} />
                <input type="text" placeholder="Stock" value={newProduct.productStock} onChange={(e) => setNewProduct({ ...newProduct, productStock: e.target.value })} />
                <button onClick={handleAddProduct}>Add Product</button>
              </div>
            </div>
            <table className="product-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Category</th>
                  <th>Type</th>
                  <th>Brand</th>
                  <th>Name</th>
                  <th>Unit</th>
                  <th>Container Type</th>
                  <th>Expiration Period</th>
                  <th>Price</th>
                  <th>Previous Price</th>
                  <th>Stock</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product._id}>
                    <td>
                      <img src={product.productImage} alt="Product" className="product-image" />
                    </td>
                    <td>
                      {editingProduct === product._id ? (
                        <input type="text" value={editedProduct.productCategory} onChange={(e) => setEditedProduct({ ...editedProduct, productCategory: e.target.value })} />
                      ) : (
                        product.productCategory
                      )}
                    </td>
                    <td>
                      {editingProduct === product._id ? (
                        <input type="text" value={editedProduct.productType} onChange={(e) => setEditedProduct({ ...editedProduct, productType: e.target.value })} />
                      ) : (
                        product.productType
                      )}
                    </td>
                    <td>
                      {editingProduct === product._id ? (
                        <input type="text" value={editedProduct.productBrand} onChange={(e) => setEditedProduct({ ...editedProduct, productBrand: e.target.value })} />
                      ) : (
                        product.productBrand
                      )}
                    </td>
                    <td>
                      {editingProduct === product._id ? (
                        <input type="text" value={editedProduct.productName} onChange={(e) => setEditedProduct({ ...editedProduct, productName: e.target.value })} />
                      ) : (
                        product.productName
                      )}
                    </td>
                    <td>
                      {editingProduct === product._id ? (
                        <input type="text" value={editedProduct.productUnit} onChange={(e) => setEditedProduct({ ...editedProduct, productUnit: e.target.value })} />
                      ) : (
                        product.productUnit
                      )}
                    </td>
                    <td>
                      {editingProduct === product._id ? (
                        <input type="text" value={editedProduct.productContainerType} onChange={(e) => setEditedProduct({ ...editedProduct, productContainerType: e.target.value })} />
                      ) : (
                        product.productContainerType
                      )}
                    </td>
                    <td>
                      {editingProduct === product._id ? (
                        <input type="text" value={editedProduct.productExpirationPeriod} onChange={(e) => setEditedProduct({ ...editedProduct, productExpirationPeriod: e.target.value })} />
                      ) : (
                        product.productExpirationPeriod
                      )}
                    </td>
                    <td>
                      {editingProduct === product._id ? (
                        <input type="text" value={editedProduct.productPrice} onChange={(e) => setEditedProduct({ ...editedProduct, productPrice: e.target.value })} />
                      ) : (
                        product.productPrice
                      )}
                    </td>
                    <td>
                      {editingProduct === product._id ? (
                        <input type="text" value={editedProduct.productPreviousPrice} onChange={(e) => setEditedProduct({ ...editedProduct, productPreviousPrice: e.target.value })} />
                      ) : (
                        product.productPreviousPrice
                      )}
                    </td>
                    <td>
                      {editingProduct === product._id ? (
                        <input type="text" value={editedProduct.productStock} onChange={(e) => setEditedProduct({ ...editedProduct, productStock: e.target.value })} />
                      ) : (
                        product.productStock
                      )}
                    </td>
                    <td className='action'>
                      {editingProduct === product._id ? (
                        <button onClick={handleSaveProduct}>Save</button>
                      ) : (
                        <div className='product-icons'>
                          <FaPen className="edit-icon" onClick={() => handleEditProduct(product)} />
                          <FaTrash className="delete-icon" onClick={() => handleDeleteProduct(product._id)} />
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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