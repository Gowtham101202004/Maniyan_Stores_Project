import React from 'react';
import CancelImage from './Cancel.gif';
import { useNavigate } from "react-router-dom";
import './Success_Cancel.css'

const Cancel = () => {
  const navigate = useNavigate();
  const handleBackClick = () => navigate("/product");

  return (
    <>
        <div className='cancel-image-container'>
            <div className='cancel-image'>
               <img src={CancelImage}/>
                <p>Payment Cancelled</p>
                <button onClick={handleBackClick}>BACK</button> 
            </div>
        </div>
    </>
  )
}

export default Cancel