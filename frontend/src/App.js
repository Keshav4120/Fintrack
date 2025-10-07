import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";

// Pages and Components
import HomePage from "./components/HomePage";
import AboutPage from "./components/AboutPage";
import UserLogin from "./components/UserLogin";
import Signup from "./components/Signup";
import UserDashboard from "./components/UserDashboard";
import AdminDashboard from "./components/AdminDashboard";
import AdminLogin from "./components/AdminLogin";
import LoanAdminLogin from "./components/LoanAdminLogin";
import FDAdminLogin from "./components/FDAdminLogin";
import MainPage from './stocks/MainPage';
import IndianStocksPage from './stocks/IndianStocksPage';
import USStocksPage from './stocks/USStocksPage';
import FDComponent from './stocks/FD/FDComponent';
import AssetDetail from './stocks/AssetDetail';
import LoanApp from './stocks/Loan/LoanApp';
import UserRegistrationForm from './components/UserRegistrationForm';
import FDAdminDashboard from './components/FDAdminDashboard';
import LoanAdminDashboard from './components/LoanDashboard';
import ForgotPassword from './pages/components/ForgotPassword';
import OtpVerification from './pages/components/OTPVerification';
import ResetPassword from './pages/components/ResetPassword';
import './global.css';
import './App.css';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import { jwtDecode } from 'jwt-decode';

// NavbarVisibility component to handle conditional rendering
function NavbarVisibility({ children }) {
  const location = useLocation();
  const hideNavbarRoutes = ["/register"]; // Add routes here

  return (
    <>
      {!hideNavbarRoutes.includes(location.pathname) && <Navbar />}
      {children}
    </>
  );
}

function App() {
  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem("token");

      if (token) {
        try {
          const decodedToken = jwtDecode(token);
          const email = decodedToken.email; // Assuming email is part of the token

          const response = await fetch("http://localhost:3001/api/recieve-email", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email }),
          });

          if (response.ok) {
            console.log("Token validated and email sent to backend.");
          } else {
            console.error("Failed to validate token or send email.");
            localStorage.removeItem("token");
          }
        } catch (error) {
          console.error("Error during token validation:", error.message);
          localStorage.removeItem("token");
        }
      }
    };

    validateToken();
  }, []);

  return (
    <Router>
      <NavbarVisibility>
        <Routes>
          {/* Home and Auth Routes */}
          <Route path="/" element={<AboutPage />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<UserLogin />} />
          <Route path="/admin" element={<HomePage />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/loan-admin-login" element={<LoanAdminLogin />} />
          <Route path="/fd-admin-login" element={<FDAdminLogin />} />
          <Route path="/About" element={<AboutPage />} />
          
          {/* User Routes */}
          <Route path="/register" element={<UserRegistrationForm />} />
          {/* Protected Route for Dashboard */}
          <Route path="/dashboard" element={<PrivateRoute><MainPage /></PrivateRoute>} />
          {/* Stock Routes */}
          <Route path="/stocks" element={<MainPage />} />
          <Route path="/indian-stocks" element={<IndianStocksPage />} />
          <Route path="/us-stocks" element={<USStocksPage />} />
          <Route path="/fd" element={<FDComponent />} />
          <Route path="/assets/:id" element={<AssetDetail />} />
          {/* Protected Route for Loan Application */}
          <Route path="/apply-loan" element={<PrivateRoute><LoanApp /></PrivateRoute>} />
          <Route path="/forgot-password" element={<ForgotPassword />} /> {/* Forgot Password route */}
          <Route path="/otp-verification" element={<OtpVerification />} /> {/* OTP Verification route */}
          <Route path="/reset-password" element={<ResetPassword />} /> {/* Add this line to use ResetPassword */}
          <Route path="/bonds" element={<UserDashboard />} />
          {/* Admin Dashboard Routes */}
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/fd-admin-dashboard" element={<FDAdminDashboard />} />
          <Route path="/loan-admin-dashboard" element={<LoanAdminDashboard />} />
        </Routes>
      </NavbarVisibility>
    </Router>
  );
}

export default App;
