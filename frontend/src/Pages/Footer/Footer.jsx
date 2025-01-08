import React from 'react';
import './Footer.css';
import maniyan_store_logo from '../../assets/maniyan_stores_white.png';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <img className='ms-logo2' src={maniyan_store_logo} alt="Maniyan Stores Logo" />
          <div className='about-maniyan-stores'>
            <p>We offer a wide range of fresh and quality grocery products, ensuring convenience, affordability, and customer satisfaction. Shop from trusted brands and enjoy a seamless online shopping experience tailored to meet your daily essentials.</p>
          </div>
        </div>
        <div className="footer-section quick-links">
          <h3>Quick Links</h3>
          <ul>
            <li><a href="/product">Products</a></li>
            <li><a href="/about">About Us</a></li>
            <li><a href="/contact">Contact Us</a></li>
            <li><a href="/help">Help</a></li>
          </ul>
        </div>
        <div className="footer-section">
          <h3>Contact Us</h3>
          <p><strong>Phone:</strong> </p>
          <p><strong>Email:</strong> maniyanstores11@gmail.com</p>
          <p><strong>Address:</strong> 3/57, Kangayam Road, Uthukkuli R.S,<br></br>Uthukuli Taluk, Tiruppur - 638752</p>
        </div>
      </div>
      <div className="footer-bottom">
        &copy; 2024 Maniyan Stores | All Rights Reserved
      </div>
    </footer>
  );
}

export default Footer;
