import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Home from './Pages/Home';
import Product from './Pages/Product/Product';
import Contact from './Pages/Contact/Contact';
import About from './Pages/About/About';
import Signin from './Auth/Signin';
import Signup from './Auth/Signup';
import Footer from './Pages/Footer/Footer';

function Layout() {
  const location = useLocation();
  const showFooter = !['/signin', '/signup', '/contact', '/product', '/about'].includes(location.pathname);

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product" element={<Product />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
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
