import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setCurrentUser } from "../redux/user/userSlice";
import '../style/otp.css'

const Otpverification = () => {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email; // Get email passed from Login component
  const dispatch = useDispatch();
  
  const updatenumber =(e)=>{
    e.preventDefault();
    navigate("/update-phone")
  }
  const handleOtpSubmit = async (e) => {
    e.preventDefault();

    console.log("Sending OTP verification request with:", { email, otp }); 
    try {
       
        const response = await axios.post(
            "http://localhost:3000/api/auth/verify-otp",
            { email, otp },
            { withCredentials: true } // This allows cookies to be set
        );
        

      console.log("Response from server:", response.data);
      dispatch(setCurrentUser(response?.data?.user?.username));
      if (response.data) {
        toast.success(response.data.message || "OTP Verified Successfully!");
        navigate("/home");
      } else {
        setError("Invalid OTP. Please try again.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to verify OTP");
    }
  };

  return (
    <div className="overlay">
    <div className="otp-container">
      <h2>OTP Verification</h2>
      <p>A verification code has been sent to your email: {email}</p>
      <input
        type="text"
        placeholder="Enter OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        className="otp-input"
      />
      <div className="button-link">
      <div style={{display:'flex', justifyContent:'flex-start'}}>
      <a href="#" alt="number" onClick={updatenumber}>Update Number</a>
      </div>
    <div style={{marginTop:'21px'}}>
    <button onClick={handleOtpSubmit} className="otp-button">
        Verify OTP
      </button>
    </div>
      </div>
      {message && <div className="success-message">{message}</div>}
      {error && <div className="error-message">{error}</div>}
    </div>
  </div>
  
  );
};

export default Otpverification;
