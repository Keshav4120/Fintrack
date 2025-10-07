import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css'; // Import the CSS file

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the user is logged in by verifying token in localStorage
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }

    // Close the menu if clicked outside
    const handleClickOutside = (event) => {
      if (!event.target.closest('.user-icon-container')) {
        setShowMenu(false);
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    // Remove the token and other data from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('showUSStocks');
    localStorage.removeItem('showStocks');
    setIsLoggedIn(false);
    navigate('/login');
  };

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  return (
    <nav className="navbar">
      <div className="logo-container">
        FinTrack
      </div>
      <div className="right-container">
        {!isLoggedIn ? (
          <div className="auth-buttons">
            <Link to="/login" className="login-button">Login</Link>
            <Link to="/signup" className="signup-button">Sign Up</Link>
          </div>
        ) : (
          <div className="user-icon-container">
            <button onClick={toggleMenu} className="user-icon">👤</button>
            {showMenu && (
              <div className="menu">
                <button onClick={handleLogout} className="menu-item">Log Out</button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
