import React, { useEffect, useState } from 'react';
import { auth, provider } from '../Auth/Firebase';
import { signInWithPopup } from 'firebase/auth';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './style.css';
import Home from '../Pages/Home';
import Google from '../assets/google.png';
import Toaster from './Toaster';
import Lottie from 'lottie-react';
import Login_Animation from '../assets/Login_Animation.json'
import ms_title from '../assets/maniyan_stores.png'

function Signin() {
  const [value, setValue] = useState('');
  const [data, setData] = useState({ email: '', password: '' });
  const [logInStatus, setLogInStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('userStatus') === 'true';
    if (isLoggedIn) {
      navigate('/');
    }
  }, [navigate]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!data.email || !data.password) {
      setLogInStatus({ msg: 'Fill in all fields!', key: Math.random(), severity: 'error' });
    } else if (data.password.length < 6) {
      setLogInStatus({ msg: 'Password must be at least 6 characters long', key: Math.random(), severity: 'error' });
    } else {
      setLoading(true);
      try {
        const config = {
          headers: {
            'Content-Type': 'application/json',
          },
        };
        const res = await axios.post('http://localhost:8080/user/login', data, config);
        console.log('Login response:', res.data);

        localStorage.setItem('token', res.data.token);
        localStorage.setItem('userdata', JSON.stringify(res.data));
        localStorage.setItem('userStatus', 'true');

        setLogInStatus({ msg: 'Login Successful! 😎', key: Math.random(), severity: 'success' });

        setTimeout(() => {
          navigate('/');
        }, 2000);
        
      } catch (err) {
        console.error('Axios Error -> ', err.response ? err.response.data : err.message);
        setLogInStatus({
          msg: err.response ? err.response.data.message : 'Invalid email or password. Please try again.',
          key: Math.random(),
          severity: 'error',
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const handleGoogleSignIn = () => {
    signInWithPopup(auth, provider)
      .then(async (data) => {
        const user = {
          name: data.user.displayName,
          email: data.user.email,
        };
  
        try {
          const res = await axios.post("http://localhost:8080/user/google-login", user, {
            headers: {
              "Content-Type": "application/json",
            },
          });
  
          console.log("Google Login Response: ", res.data);
  
          localStorage.setItem("token", res.data.token);
          localStorage.setItem("userdata", JSON.stringify(res.data));
          localStorage.setItem("userStatus", "true");
  
          setLogInStatus({
            msg: "Google Sign-In Successful! 😎",
            key: Math.random(),
            severity: "success",
          });
  
          navigate("/");
        } catch (err) {
          console.error("Google Sign-In Error -> ", err.response ? err.response.data : err.message);
          setLogInStatus({
            msg: err.response ? err.response.data.message : "Google Sign-In Failed. Please try again.",
            key: Math.random(),
            severity: "error",
          });
        }
      })
      .catch((err) => {
        console.error("Google Sign-In Popup Error -> ", err);
        setLogInStatus({
          msg: "Google Sign-In Failed. Please try again.",
          key: Math.random(),
          severity: "error",
        });
      });
  };
  

  useEffect(() => {
    setValue(localStorage.getItem('name') || '');
  }, []);

  const handleToasterClose = () => {
    if (logInStatus?.severity === 'success') {
      // Additional logic after success toast closes, if needed
    }
  };

  return (
    <div>
      <div className="main-container">
        <div className="container-left">
          <img src={ms_title} alt='logo' className='ms_title'/>
          <Lottie animationData={Login_Animation} className='login-animation'/>
        </div>
        <div className="container-right">
          <div style={{  height: "390px" }} className="box">
            <form onSubmit={handleLogin}>
              <h1>Sign in</h1>
              <div className="inputBox">
                <input type="email" name="email" value={data.email} onChange={handleChange} required />
                <span>Email</span>
                <i></i>
              </div>
              <div className="inputBox">
                <input type="password" name="password" value={data.password} onChange={handleChange} required />
                <span>Password</span>
                <i></i>
              </div>
              <div className="links">
                  <a href="#">Forgot Password?</a>
              </div>
              <button type="submit" className="login-button" disabled={loading}>
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
              <div className='last'>
                  <p>Don't have an account?&nbsp;<u onClick={() => navigate('/signup')}>Sign up</u></p>
              </div>
              <div className="divider">
                <span>or</span>
              </div>
            </form>
            {value ? (
              <Home />
            ) : (
              <button onClick={handleGoogleSignIn} className="g-login">
                <img src={Google} alt="Google Icon" />Sign in with Google
              </button>
            )}
            {logInStatus && (
              <Toaster
                key={logInStatus.key}
                message={logInStatus.msg}
                severity={logInStatus.severity}
                onClose={handleToasterClose}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signin;
