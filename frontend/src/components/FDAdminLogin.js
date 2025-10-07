import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function FDAdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    
    // Sample credentials for FD admin (this should be replaced with real authentication logic)
    const validUsername = 'fdadmin@gmail.com';
    const validPassword = 'fdadmin@123456';

    if (username === validUsername && password === validPassword) {
      // Redirect to FD Admin Dashboard if credentials are correct
      navigate('/fd-admin-dashboard');
    } else {
      setErrorMessage('Invalid username or password');
    }
  };

  return (
    <div className="fd-admin-login">
      <h1>FD Admin Login</h1>
      
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

        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

        <div>
          <button type="submit">Login</button>
        </div>
      </form>
    </div>
  );
}

export default FDAdminLogin;
