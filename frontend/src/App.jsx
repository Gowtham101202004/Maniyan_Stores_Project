import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Home from './Pages/Home';
import Product from './Pages/Product/Product';
import Contact from './Pages/Contact/Contact';
import About from './Pages/About/About';
import Signin from './Auth/Signin';
import Signup from './Auth/Signup';
import Footer from './Pages/Footer/Footer';
import ProductItem from './Pages/ProductItem/ProductItem';
import Cart from './Pages/Cart/Cart';
import Payment from './Pages/Payment/Payment';
import EditProfile from './Pages/Edit_Profile/EditProfile';
import Admin from './Admin/Admin';
import Success from './Pages/Payment/Success';
import Cancel from './Pages/Payment/Cancel';
import Order from './Pages/Order/Order'
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import Loading_Animation from './Pages/Animation/Loading_Animation';

function Layout() {
  const location = useLocation();
  const showFooter = !['/signin', '/signup', '/contact', '/product', '/about', '/product', '/payment', '/editprofile', '/admin', '/success', '/cancel', '/order' ].includes(location.pathname);

  const stripePromise = loadStripe('pk_test_51QtmfA4UOuOwfYxg19NwyFBuoXUF8OLSP5ihvTjtnx17twwzmRcPn5oAlNWChooHQDCBpmnf1JdHqNU4Gcp0HWn8005ECLGwRx');

  return (
    <>
      <Loading_Animation />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/product" element={<Product />} />
        <Route path="/product/:id" element={<ProductItem />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/editprofile" element={<EditProfile />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
        <Route path="/success" element={<Success />} />
        <Route path="/cancel" element={<Cancel />} />
        <Route path="/order" element={<Order />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        
        {/* Wrap Payment route with Elements from Stripe */}
        <Route
          path="/payment"
          element={
            <Elements stripe={stripePromise}>
              <Payment />
            </Elements>
          }
        />
      </Routes>
      {showFooter && <Footer />}
    </>
  );
}

function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}

export default App;
