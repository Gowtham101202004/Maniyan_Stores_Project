import React from 'react'
import SuccessImage from './Success.gif'
import { useNavigate } from "react-router-dom";
import './Success_Cancel.css'

const Success = () => {
  const navigate = useNavigate();
  const handleOrderClick = () => navigate("/order");

  return (
    <>
        <div className='success-image-container'>
            <div className='success-image'>
               <img src={SuccessImage}/>
                <p>Payment Successfull</p>
                <button onClick={handleOrderClick}>SEE ORDER</button> 
            </div>
        </div>
    </>
  )
}

export default Success