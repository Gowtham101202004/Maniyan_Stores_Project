import React from 'react'
import Navbar from './Navbar/Navbar';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTruckFast, faLeaf, faCreditCard } from "@fortawesome/free-solid-svg-icons";
import './Home.css'
import Slider from './Slider/Slider'

function Home() {

  return (
    <div>
        <Navbar/>
        <Slider/>
        <div className="features-section">
          <div className="feature">
            <i className="fa fa-truck feature-icon">
              <FontAwesomeIcon icon={faTruckFast} />
            </i>
            <h3>Fast Delivery</h3>
            <p>Get fresh groceries delivered to your home quickly and safely.</p>
          </div>
          <div className="feature">
            <i className="fa fa-leaf feature-icon">
              <FontAwesomeIcon icon={faLeaf} />
            </i>
            <h3>Fresh Produce</h3>
            <p>We offer only the freshest fruits, vegetables, and herbs.</p>
          </div>
          <div className="feature">
            <i className="fa fa-credit-card feature-icon">
              <FontAwesomeIcon icon={faCreditCard} />
            </i>
            <h3>Secure Payment</h3>
            <p>Shop with confidence with our secure payment options.</p>
          </div>
        </div>
    </div>
  )
}

export default Home
