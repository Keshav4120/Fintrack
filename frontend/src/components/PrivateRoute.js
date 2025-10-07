import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');  // Check if there's a token (indicating logged-in user)

  if (!token) {
    // Redirect to login page if not authenticated
    return <Navigate to="/login" />;
  }

  return children;  // Render the children if authenticated
};

export default PrivateRoute;
