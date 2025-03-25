import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FaQuestionCircle, FaShippingFast, FaExchangeAlt, FaMoneyBillWave, FaLock } from 'react-icons/fa';
import './Help.css';

const Help = () => {
  const [activeTab, setActiveTab] = useState('faq');
  const [expandedQuestion, setExpandedQuestion] = useState(null);

  const navigate = useNavigate();
  const handleBackClick = () => navigate(-1);

  const toggleQuestion = (index) => {
    setExpandedQuestion(expandedQuestion === index ? null : index);
  };

  const faqs = [
    {
      question: "How do I place an order?",
      answer: "Simply browse our products, add items to your cart, and proceed to checkout. You'll need to provide shipping information and payment details to complete your order."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit/debit cards, PayPal, UPI payments, and Cash on Delivery (COD) for eligible orders."
    },
    {
      question: "How can I track my order?",
      answer: "Once your order is Placed, In Order Page you can see the order status."
    },
    {
      question: "What is your return policy?",
      answer: "We offer a 30-day return policy for most items. Items must be unused, in original packaging, and with all tags attached. Some exclusions apply."
    },
    {
      question: "How long does shipping take?",
      answer: "Standard shipping typically takes 3-5 business days. Express shipping options are available at checkout for faster delivery."
    }
  ];

  return (
    <>
      <button className="help-back-button" onClick={handleBackClick}>
        <FontAwesomeIcon icon={faArrowLeft} className="faArrowLeft" />
      </button>
      <div className="help-support-container">
        <div className="help-hero">
          <h1>How can we help you today?</h1>
          <p>Find answers to common questions about your shopping experience</p>
        </div>

        <div className="help-tabs">
          <button 
            className={activeTab === 'faq' ? 'active' : ''} 
            onClick={() => setActiveTab('faq')}
          >
            <FaQuestionCircle /> FAQs
          </button>
          <button 
            className={activeTab === 'shipping' ? 'active' : ''} 
            onClick={() => setActiveTab('shipping')}
          >
            <FaShippingFast /> Shipping Info
          </button>
          <button 
            className={activeTab === 'returns' ? 'active' : ''} 
            onClick={() => setActiveTab('returns')}
          >
            <FaExchangeAlt /> Returns & Exchanges
          </button>
          <button 
            className={activeTab === 'payments' ? 'active' : ''} 
            onClick={() => setActiveTab('payments')}
          >
            <FaMoneyBillWave /> Payments
          </button>
          <button 
            className={activeTab === 'security' ? 'active' : ''} 
            onClick={() => setActiveTab('security')}
          >
            <FaLock /> Security
          </button>
        </div>

        <div className="help-content">
          {activeTab === 'faq' && (
            <div className="faq-section">
              <h2>Frequently Asked Questions</h2>
              <div className="faq-list">
                {faqs.map((faq, index) => (
                  <div 
                    key={index} 
                    className={`faq-item ${expandedQuestion === index ? 'expanded' : ''}`}
                    onClick={() => toggleQuestion(index)}
                  >
                    <div className="faq-question">
                      <h3>{faq.question}</h3>
                      <span className="toggle-icon">
                        {expandedQuestion === index ? '−' : '+'}
                      </span>
                    </div>
                    {expandedQuestion === index && (
                      <div className="faq-answer">
                        <p>{faq.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'shipping' && (
            <div className="info-section">
              <h2>Shipping Information</h2>
              <div className="info-cards">
                <div className="info-card">
                  <h3>Standard Shipping</h3>
                  <p>2-3 business days</p>
                  <p className="price">₹40</p>
                </div>
                <div className="info-card">
                  <h3>Express Shipping</h3>
                  <p>1-2 business days</p>
                  <p className="price">₹40 or FREE on orders over ₹1000</p>
                </div>
                <div className="info-card">
                  <h3>International Shipping</h3>
                  <p>7-14 business days</p>
                  <p className="price">Calculated at checkout</p>
                </div>
              </div>
              <div className="shipping-notice">
                <p>Orders placed before 2PM EST are processed the same business day. Weekend orders ship Monday.</p>
              </div>
            </div>
          )}

          {activeTab === 'returns' && (
            <div className="info-section">
              <h2>Returns & Exchanges</h2>
              <div className="simple-returns">
                <div className="returns-instruction">
                  <h3>Need to return or exchange an item?</h3>
                  <p>Simply email us at <strong>maniyanstores11@gmail.com</strong> with:</p>
                  <ul>
                    <li>Your order number</li>
                    <li>Product name and reason for return</li>
                    <li>Whether you want a refund or exchange</li>
                  </ul>
                  <p>Our team will respond within 24 hours with return instructions.</p>
                </div>
                <div className="return-policy">
                  <h3>Our Return Policy</h3>
                  <ul>
                    <li>30-day return window from delivery date</li>
                    <li>Items must be unused and in original condition</li>
                    <li>Original shipping fees are non-refundable</li>
                    <li>Refunds processed within 5-7 business days</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'payments' && (
            <div className="info-section">
              <h2>Payment Methods</h2>
              <div className="payment-methods">
                <div className="payment-method">
                  <div className="payment-icon">💳</div>
                  <h3>Credit/Debit Cards</h3>
                  <p>Visa & Mastercard</p>
                </div>
                <div className="payment-method">
                  <div className="payment-icon">📱</div>
                  <h3>Digital Wallets</h3>
                  <p>Google Pay & Other UPI Payments</p>
                </div>
                <div className="payment-method">
                  <div className="payment-icon">💰</div>
                  <h3>Cash on Delivery</h3>
                  <p>Available for all orders</p>
                </div>
              </div>
              <div className="security-info">
                <h3>Secure Checkout</h3>
                <p>All transactions are encrypted with 256-bit SSL security. We never store your full payment details on our servers.</p>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="info-section">
              <h2>Security & Privacy</h2>
              <div className="security-features">
                <div className="feature">
                  <FaLock className="feature-icon" />
                  <h3>Secure Payments</h3>
                  <p>Industry-standard encryption protects all transactions</p>
                </div>
                <div className="feature">
                  <FaLock className="feature-icon" />
                  <h3>Data Protection</h3>
                  <p>Your personal information is never shared</p>
                </div>
                <div className="feature">
                  <FaLock className="feature-icon" />
                  <h3>Account Security</h3>
                  <p>Secure session management for all logins</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Help;