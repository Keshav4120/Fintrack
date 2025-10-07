import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./UserLogin.css";
import { Button, Form } from 'react-bootstrap';
import { jwtDecode } from 'jwt-decode'; // Correct named import


const UserLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [error, setError] = useState(null);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3001/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const result = await response.json();
        const token = result.token;
        localStorage.setItem("token", token);

        // Decode the token to get the email
        const decodedToken = jwtDecode(token);
        const email = decodedToken.email; // Assuming the email is in the token
        console.log(email);
        // Now send the email to your backend
        const emailResponse = await fetch("http://localhost:3001/api/recieve-email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }) // Send email in the body
        });

        if (emailResponse.ok) {
          navigate("/register"); // Redirect after email sent to backend
        } else {
          setError("Failed to send email to backend");
        }

      } else {
        setError("Invalid email or password");
      }
    } catch (error) {
      console.error("Error during login:", error.message);
      setError("An error occurred. Please try again.");
    }
  };

  const handleForgotPassword = () => {
    // Redirect to the forgot password page
    navigate("/forgot-password");
  };

  return (
    <div className='center-form'>
      <Form onSubmit={handleSubmit}>
        <h1>User</h1>
        {error && <div style={{ color: 'red' }}>{error}</div>}
        <Form.Group controlId="formBasicEmail">
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type="email"
            name="email"
            placeholder="Enter Email"
            value={formData.email}
            onChange={handleInputChange}
          />
        </Form.Group>
        <Form.Group controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            name="password"
            placeholder="Enter Password"
            value={formData.password}
            onChange={handleInputChange}
          />
        </Form.Group>
        <Button variant="dark" type="submit" className="w-100">
          Login
        </Button>
      </Form>
        {/* Forgot Password Button */}
        <button type="button" onClick={handleForgotPassword}
        className="forgot-password-btn"
      >
        Forgot Password!
      </button>
    </div>
  );
};

export default UserLogin;
