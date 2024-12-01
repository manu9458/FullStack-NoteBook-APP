import React, { useState } from 'react';
import '../style/phone.css'
function Updatenumber() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Handle form submission for phone number update
  const handleUpdate = (e) => {
    e.preventDefault();

    // Check if phone number is valid (basic validation)
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phoneNumber)) {
      setError('Please enter a valid 10-digit phone number.');
      return;
    }

    // Simulate a successful update (no actual API call)
    setMessage('Phone number updated successfully!');
    setError(''); // Clear any previous errors
  };

  return (
    <div className="overlay-container">
      {/* Overlay Effect */}
      <div className="overlay"></div>

      <div className="update-phone-container">
        <h2>Update Phone Number</h2>

        <form onSubmit={handleUpdate}>
          <div className="input-group">
            <label htmlFor="phoneNumber">New Phone Number:</label>
            <input
              type="text"
              id="phoneNumber"
              placeholder="Enter new phone number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="input-field"
            />
          </div>

          <button type="submit" className="submit-button">Update Number</button>
        </form>

        {message && <div className="success-message">{message}</div>}
        {error && <div className="error-message">{error}</div>}
      </div>
    </div>
  );
}

export default Updatenumber;
