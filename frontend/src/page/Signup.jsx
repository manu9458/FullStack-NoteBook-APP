import React, { useState } from 'react';
import '../style/Login.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';

function Signup({ onSignupSuccess }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState(''); // New state for phone number

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!username || !email || !password || !phoneNumber) {
      toast.error('All fields are required');
      return;
    }

    try {
      const response = await axios.post(
        'https://keep-t7qy.onrender.com/api/auth/signup',
        { username, email, password, phoneNumber }, // Include phone number in the request
        { withCredentials: true }
      );

      if (response.data.success === false) {
        toast.error(response.data.message);
      } else {
        toast.success(response.data.message || 'Signup successful!');
        onSignupSuccess(); // Notify parent to switch to Login view
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <div className="login-container">
      <h2>Signup</h2>
      <form onSubmit={handleSignup}>
        <input
          type="text"
          placeholder="Username"
          className="login-input"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          className="login-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="login-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="tel"
          placeholder="Phone Number"
          className="login-input"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          required
        />
        <button type="submit" className="login-button">
          Signup
        </button>
      </form>
      <div className="login-footer">
        <p>
          Already have an account?{' '}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onSignupSuccess(); // Notify parent to switch back to Login view
            }}
          >
            Login
          </a>
        </p>
      </div>
    </div>
  );
}

export default Signup;
