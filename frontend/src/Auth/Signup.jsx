import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './style.css';
import Toaster from './Toaster';
import Lottie from 'lottie-react';
import Login_Animation from '../assets/Login_Animation.json';
import ms_title from '../assets/maniyan_stores.png'


function Signin() {
  const navigate = useNavigate();
  const [data, setData] = useState({ name: '', email: '', password: '' });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [registerStatus, setRegisterStatus] = useState('');
  const [loading, setLoading] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  // Validate and handle form submission
  const validateData = async (e) => {
    e.preventDefault();

    const emailCheck = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!data.name || !data.email || !data.password || !confirmPassword) {
      setRegisterStatus({ msg: 'All fields are required!', key: Math.random() });
    } else if (!emailCheck.test(data.email)) {
      setRegisterStatus({ msg: 'Invalid email format!', key: Math.random() });
    } else if (data.password !== confirmPassword) {
      setRegisterStatus({ msg: 'Passwords do not match!', key: Math.random() });
    } else if (data.password.length < 6) {
      setRegisterStatus({ msg: 'Password must be at least 6 characters!', key: Math.random() });
    } else {
      try {
        setLoading(true);
        const config = {
          headers: {
            'Content-Type': 'application/json',
          },
        };

        await axios.post('http://localhost:8080/user/register', data, config);
        setRegisterStatus({
          msg: 'Account created successfully! 😎',
          key: Math.random(),
          severity: 'success',
        });
        setTimeout(() => {
          navigate('/signin');
        }, 2000);
      } catch (err) {
        if (err.response && err.response.data && err.response.data.message) {
          setRegisterStatus({
            msg: err.response.data.message,
            key: Math.random(),
            severity: 'error',
          });
        } else {
          setRegisterStatus({
            msg: 'Registration failed. Try again.',
            key: Math.random(),
            severity: 'error',
          });
        }
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div>
      <div className="main-container">
        <div className="container-left">
          <img src={ms_title} alt='logo' className='ms_title'/>
          <Lottie animationData={Login_Animation} className="login-animation" />
        </div>
        <div className="container-right">
          <div style={{ height: '430px' }} className="box">
            <form onSubmit={validateData}>
              <h1>Sign up</h1>
              <div className="inputBox">
                <input
                  type="text"
                  name="name"
                  value={data.name}
                  onChange={handleChange}
                  required
                />
                <span>Name</span>
                <i></i>
              </div>
              <div className="inputBox">
                <input
                  type="email"
                  name="email"
                  value={data.email}
                  onChange={handleChange}
                  required
                />
                <span>Email</span>
                <i></i>
              </div>
              <div className="inputBox">
                <input
                  type="password"
                  name="password"
                  value={data.password}
                  onChange={handleChange}
                  required
                />
                <span>Password</span>
                <i></i>
              </div>
              <div className="inputBox">
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <span>Confirm Password</span>
                <i></i>
              </div>
              <button type="submit" className="login-button" disabled={loading}>
                {loading ? 'Signing up...' : 'Sign up'}
              </button>
              <div className="last">
                <p>
                  Already have an account?&nbsp;
                  <u onClick={() => navigate('/signin')}>Sign in</u>
                </p>
              </div>
            </form>
            {registerStatus && (
              <Toaster
                key={registerStatus.key}
                message={registerStatus.msg}
                severity={registerStatus.severity}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signin;
