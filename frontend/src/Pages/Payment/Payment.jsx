import React, { useState, useEffect } from 'react';
import { useStripe, useElements, CardNumberElement, CardExpiryElement, CardCvcElement } from '@stripe/react-stripe-js';
import { useLocation } from 'react-router-dom';
import './payment.css';

const Payment = () => {
  const stripe = useStripe();
  const elements = useElements();
  const location = useLocation();

  const product = location.state?.product;
  const [amount, setAmount] = useState(product?.productPrice || 500);
  const [clientSecret, setClientSecret] = useState('');
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [paymentMethod, setPaymentMethod] = useState(null);

  useEffect(() => {
    const fetchClientSecret = async () => {
      try {
        const response = await fetch('http://localhost:8080/payment/create-payment-intent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ amount }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Network response was not ok');
        }

        const data = await response.json();
        if (data.clientSecret) {
          setClientSecret(data.clientSecret);
          setLoading(false);
        } else {
          throw new Error('Failed to get client secret');
        }
      } catch (error) {
        console.error('Error fetching client secret:', error);
        setErrorMessage(error.message);
        setLoading(false);
      }
    };

    fetchClientSecret();
  }, [amount]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements || !clientSecret) {
      console.error('Stripe.js is not loaded yet.');
      return;
    }

    const cardNumberElement = elements.getElement(CardNumberElement);
    const cardExpiryElement = elements.getElement(CardExpiryElement);
    const cardCvcElement = elements.getElement(CardCvcElement);

    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardNumberElement,
      },
    });

    if (error) {
      console.error(error.message);
      alert('Payment failed');
    } else if (paymentIntent.status === 'succeeded') {
      alert('Payment succeeded!');
      console.log(paymentIntent);
    }
  };

  return (
    <div className="payment-container">
      <div className="payment-left">
        <h2>Choose Payment Method</h2>
        <button className="payment-button" onClick={() => setPaymentMethod('card')}>Debit/Credit Card</button>
        <button className="payment-button" onClick={() => setPaymentMethod('gpay')}>Google Pay</button>
        
        {paymentMethod === 'card' && (
          <form onSubmit={handleSubmit} className="payment-form">
            <label>Card Number</label>
            <CardNumberElement className="card-element" />
            <label>Expiry Date</label>
            <CardExpiryElement className="card-element" />
            <label>CVC</label>
            <CardCvcElement className="card-element" />
            <button type="submit" disabled={!stripe || !clientSecret || loading} className="pay-button">
              {loading ? 'Processing...' : `Pay ₹${amount}`}
            </button>
          </form>
        )}

        {paymentMethod === 'gpay' && (
          <div className="gpay-box">
            <h3>Google Pay Integration Coming Soon</h3>
          </div>
        )}
      </div>

      <div className="payment-right">
        <h3>Order Summary</h3>
        <p>Product: {product?.productName || 'Product'}</p>
        <p>Price: ₹{amount}</p>
      </div>
    </div>
  );
};

export default Payment;
