// OtpModal.js
import React, { useState } from 'react';
import Modal from 'react-modal';
import { toast } from 'react-toastify';
import axios from 'axios';

function OtpModal({ isOpen, onRequestClose, onSuccess }) {
  const [otp, setOtp] = useState('');

  // Handle OTP Submit
  const handleOtpSubmit = async () => {
    try {
      const response = await axios.post('http://localhost:3000/api/auth/verify-otp', {
        otp,
      });

      if (response.data.success) {
        toast.success('OTP verified successfully!');
        onSuccess();  // Callback after successful OTP verification
        onRequestClose();  // Close OTP modal
      } else {
        toast.error('Invalid OTP. Please try again.');
      }
    } catch (error) {
      toast.error(error.message || 'OTP verification failed');
    }
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} contentLabel="OTP Modal">
      <h2>Enter OTP</h2>
      <input
        type="text"
        placeholder="Enter OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
      />
      <button onClick={handleOtpSubmit}>Verify OTP</button>
      <button onClick={onRequestClose}>Cancel</button>
    </Modal>
  );
}

export default OtpModal;
