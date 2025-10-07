import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./Signup.css";
import { Form, Button, Alert } from 'react-bootstrap';

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    name: '',
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
      console.log("Submitting form with data:", formData); // Log form data before submission
      const response = await fetch("http://localhost:3001/user/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      console.log("Response from API:", data); // Log response from the API
      
      if (response.ok) {
        console.log("Signup successful"); // Log success
        navigate("/login"); // Redirect to login after successful signup
      } else {
        setError(data.message || "Failed to create account. Please try again.");
        console.log("Error from API:", data.message);
      }
    } catch (error) {
      console.error("Error during signup:", error.message); // Log any fetch errors
      setError("An error occurred. Please try again.");
    }
  };
  

  return (
    <div className='center-form'>
      <Form onSubmit={handleSubmit}>
        <h1>Signup</h1>
        {error && <Alert variant='danger'>{error}</Alert>}
        
       
        <Form.Group controlId="formBasicName">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            name="name"
            placeholder="Enter Name"
            value={formData.name}
            onChange={handleInputChange}
            style={{ padding: '10px', backgroundColor: '#444', color: '#ffffff', border: '1px solid #555', borderRadius: '5px' }}
            className={formData.name ? 'form-control-filled' : ''}
          />
        </Form.Group>

        {/* Email input second */}
        <Form.Group controlId="formBasicEmail">
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type="email"
            name="email"
            placeholder="Enter Email"
            value={formData.email}
            onChange={handleInputChange}
            style={{ padding: '10px', backgroundColor: '#444', color: '#ffffff', border: '1px solid #555', borderRadius: '5px' }}
            className={formData.email ? 'form-control-filled' : ''}
          />
        </Form.Group>

        {/* Password input last */}
        <Form.Group controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            name="password"
            placeholder="Enter Password"
            value={formData.password}
            onChange={handleInputChange}
            style={{ padding: '10px', backgroundColor: '#444', color: '#ffffff', border: '1px solid #555', borderRadius: '5px' }}
            className={formData.password ? 'form-control-filled' : ''}
          />
        </Form.Group>

        <Button variant="dark" type="submit" className="w-100">
          Signup
        </Button>
      </Form>
    </div>
  );
};

export default Signup;
