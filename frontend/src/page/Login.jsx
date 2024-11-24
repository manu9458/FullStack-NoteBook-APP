import React, { useState } from 'react';
import '../style/Login.css';
import Signup from './Signup';
import { useDispatch } from 'react-redux';
import { validateEmail } from '../utills/helper';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { signInFailure, signInStart, signInSuccess } from '../redux/user/userSlice';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {setCurrentUser} from '../redux/user/userSlice';
function Login() {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    if (!password) {
      setError("Please enter the password");
      return;
    }

    setError("");

    try {
      dispatch(signInStart());
      const response = await axios.post('http://localhost:3000/api/auth/signin', {
        email,
        password
      }, { withCredentials: true });

      if (response.data.success === false) {
        dispatch(signInFailure(response.data.message));
        setError(response.data.message); // Set error message from API
      } else {
        dispatch(signInSuccess(response.data));
        toast.success(response.data.message || 'Login successful!');
        console.log(response?.data?.user?.username)
        navigate('/home');
        dispatch(setCurrentUser(response?.data?.user?.username));
        
      }
    } catch (error) {
      toast.error(error.message);
      setError(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="login-overlay">
      {isSignup ? (
        <Signup onSignupSuccess={() => setIsSignup(false)} />
      ) : (
        <div className="login-container">
          <h2>Login</h2>
          <form onSubmit={handleLogin}>
            <input
              type="text"
              placeholder="Email"
              className="login-input"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              required
            />
            <div className="password-wrapper">
              <input
                type="password"
                placeholder="Password"
                className="login-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {/* Display Error Message */}
            {error && <div className="error-message">{error}</div>}
            <button type="submit" className="login-button">
              Login
            </button>
          </form>
          <div className='forgot-password'>
          <a href="#">Forgot Password?</a>
          </div>
          <div className="login-footer">
            <p>
              Not yet registered?{' '}
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setIsSignup(true);
                }}
              >
                Create an account
              </a>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Login;
