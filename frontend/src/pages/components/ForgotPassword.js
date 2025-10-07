import React, { useState } from 'react';
// import { handleError, handleSuccess } from ""
import { useNavigate } from 'react-router-dom';
// import { ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3001/api/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const result = await response.json();
      if (result.success) {
       
        // handleSuccess(result.message);
        // Pass the email as state while navigating
        navigate('/otp-verification', { state: { email } });
      } else {
        alert(result?.message??'error occured')
        // handleError(result.message);
      }
    } catch (error) {
      alert(error?.message)
      // handleError('Failed to send OTP');
    }
  };

  return (
    <div style={{ backgroundColor: '#f0f8f5', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ backgroundColor: '#fff', padding: '40px', borderRadius: '8px', boxShadow: '0 0 15px rgba(0, 0, 0, 0.1)', width: '100%', maxWidth: '400px' }}>
        <h2 style={{ color: '#006d5b', textAlign: 'center', marginBottom: '20px' }}>Forgot Password</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label htmlFor='email' style={{ color: '#333', marginBottom: '5px', display: 'block' }}>Email</label>
            <input
              type="email"
              name='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              autoFocus
              style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd', marginBottom: '10px', fontSize: '16px' }}
            />
          </div>
          <button type="submit" style={{ width: '100%', padding: '12px', borderRadius: '4px', border: 'none', backgroundColor: '#006d5b', color: '#fff', fontSize: '16px', cursor: 'pointer', transition: 'background-color 0.3s ease' }}>Send OTP</button>
        </form>
      </div>
      {/* <ToastContainer></ToastContainer> abb check kar */}
    </div>
  );
};

export default ForgotPassword;

