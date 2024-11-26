// PhoneUpdateModal.js
import React, { useState } from 'react';
import Modal from 'react-modal';
import { toast } from 'react-toastify';
import axios from 'axios';

function PhoneUpdateModal({ isOpen, onRequestClose, onUpdateSuccess }) {
  const [phoneNumber, setPhoneNumber] = useState('');

  // Handle Phone Number Update
  const handlePhoneUpdate = async () => {
    try {
      const response = await axios.post('http://localhost:3000/api/auth/update-phone', {
        phoneNumber,
      });

      if (response.data.success) {
        toast.success('Phone number updated successfully!');
        onUpdateSuccess();  // Callback after successful phone update
        onRequestClose();  // Close phone update modal
      } else {
        toast.error('Failed to update phone number');
      }
    } catch (error) {
      toast.error(error.message || 'Phone update failed');
    }
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} contentLabel="Phone Number Update Modal">
      <h2>Update Phone Number</h2>
      <input
        type="text"
        placeholder="Enter new phone number"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
      />
      <button onClick={handlePhoneUpdate}>Update</button>
      <button onClick={onRequestClose}>Cancel</button>
    </Modal>
  );
}

export default PhoneUpdateModal;
