import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import '../styles/Login.css';

function Login({ role }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null); // To display errors
    const navigate = useNavigate();

    useEffect(() => {
        // Redirect if the user is already logged in (based on token presence)
        const token = localStorage.getItem(role === "admin" ? "adminToken" : "token");
        if (token) {
            navigate(role === "admin" ? "/admin-dashboard" : "/user-dashboard");
        }
    }, [navigate, role]);

    const handleLogin = async () => {
        try {
            const response = await axios.post("http://localhost:3001/auth/login", {
                email,
                password,
            });

            // Save token and navigate
            localStorage.setItem(role === "admin" ? "adminToken" : "token", response.data.token);
            alert("Login successful!");
            navigate(role === "admin" ? "/admin-dashboard" : "/user-dashboard");
        } catch (error) {
            setError(error.response?.data?.message || "Login failed. Please try again.");
        }
    };

    return (
        <div>
            <h2>Login as {role === "admin" ? "Admin" : "User"}</h2>
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            {error && <p style={{ color: "red" }}>{error}</p>}
            <button onClick={handleLogin}>Login</button>
        </div>
    );
}

export default Login;

