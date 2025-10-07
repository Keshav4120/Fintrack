import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
// import { handleError, handleSuccess } from './utils';
// import { ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

const OTPVerification = () => {
  const location = useLocation();
  const email = location.state?.email;  // Extract email from state passed via navigation
  const [otp, setOtp] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch('http://localhost:3001/api/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });
      const result = await response.json();
      if (result.success) {
        
        // Pass email to ResetPassword component via navigation state
        navigate('/reset-password', { state: { email } });
      } else {
        
      }
    } catch (error) {
      
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#f0f8f5', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ backgroundColor: '#fff', padding: '40px', borderRadius: '8px', boxShadow: '0 0 15px rgba(0, 0, 0, 0.1)', width: '100%', maxWidth: '400px' }}>
        <h2 style={{ color: '#006d5b', textAlign: 'center', marginBottom: '20px' }}>Enter OTP</h2>
        <form onSubmit={handleOtpSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label htmlFor="otp" style={{ color: '#333', marginBottom: '5px', display: 'block' }}>OTP</label>
            <input
              type="text"
              name="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter the OTP sent to your email"
              required
              style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd', marginBottom: '10px', fontSize: '16px' }}
            />
            </div>
          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '4px',
              border: 'none',
              backgroundColor: '#006d5b',
              color: '#fff',
              fontSize: '16px',
              cursor: 'pointer',
              transition: 'background-color 0.3s ease',
            }}
          >
            {isSubmitting ? 'Verifying...' : 'Verify OTP'}
          </button>
        </form>
      </div>
      {/* <ToastContainer /> */}
    </div>
  );
};

export default OTPVerification;




