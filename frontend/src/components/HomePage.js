import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/HomePage.css";

function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="home-page">
      <h1>Welcome to FinTrack Admin Side</h1>
      <div className="admin-options">
        <h2>Admin Login</h2>
        <button onClick={() => navigate("/admin-login")}>
          Login as Bond Admin
        </button>
        <button onClick={() => navigate("/loan-admin-login")}>
          Login as Loan Admin
        </button>
        <button onClick={() => navigate("/fd-admin-login")}>
          Login as FD Admin
        </button>
      </div>
    </div>
  );
}

export default HomePage;
