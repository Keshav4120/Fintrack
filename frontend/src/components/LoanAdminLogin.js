import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';


function LoanAdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    
    // Sample credentials for loan admin (this should be replaced with real authentication logic)
    const validUsername = 'loanadmin@gmail.com';
    const validPassword = 'loanadmin@123456';

    if (username === validUsername && password === validPassword) {
      // Redirect to Loan Admin Dashboard if credentials are correct
      navigate('/loan-admin-dashboard');
    } else {
      setErrorMessage('Invalid username or password');
    }
  };

  return (
    <div className="loan-admin-login">
      <h1>Loan Admin Login</h1>
      
      <form onSubmit={handleLogin}>
        <div>
          <label>Username</label>
          <input 
            type="text" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            required 
          />
        </div>

        <div>
          <label>Password</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
        </div>

        {errorMessage && <p className="error-message">{errorMessage}</p>} {/* Added class for styling */}

        <div>
          <button type="submit">Login</button>
        </div>
      </form>
    </div>
  );
}

export default LoanAdminLogin;
