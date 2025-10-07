import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/userRegistrationForm.css';

const UserRegistrationForm = () => {
  const [formData, setFormData] = useState({
    Name: '',
    surname: '',
    jobTitle: '',
    employmentStatus: '',
    state: '',
    city: '',
    zip: '',
    phoneNumber: '',
    panNumber: '',
    streetAddress: '',
    country: '',
    emailNotifications: true,
    smsNotifications: true,
    preferredContactMethod: 'email',
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const validateForm = () => {
    const newErrors = {};
    for (const key in formData) {
      if (formData[key] === '' && key !== 'emailNotifications' && key !== 'smsNotifications') {
        newErrors[key] = `${key} is required`; // Corrected syntax for template literal
      }
      
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const token = localStorage.getItem('token'); // Retrieve the JWT token from local storage

    try {
      const response = await fetch('http://localhost:3001/api/user/submitProfile', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Corrected template literal syntax
        },
        
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        navigate('/dashboard');
      } else {
        const result = await response.text();
        alert(`Submission failed: ${result}`); // Corrected syntax

      }
    } catch (error) {
      console.error('Error submitting profile:', error);
      alert('An error occurred while submitting your profile. Please try again later.');
    }
  };

  return (
    <div className="registration-form">
      <h1>User Registration Form</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="Name">Name:</label>
          <input
            type="text"
            id="Name"
            name="Name"
            value={formData.Name}
            onChange={handleChange}
            required
            pattern="^[A-Za-z]+$"
            title="Name should only contain alphabets."
          />
          {errors.Name && <p className="error">{errors.Name}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="surname">Surname:</label>
          <input
            type="text"
            id="surname"
            name="surname"
            value={formData.surname}
            onChange={handleChange}
            required
            pattern="^[A-Za-z]+$"
            title="Surname should only contain alphabets."
          />
          {errors.surname && <p className="error">{errors.surname}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="jobTitle">Job Title:</label>
          <input
            type="text"
            id="jobTitle"
            name="jobTitle"
            value={formData.jobTitle}
            onChange={handleChange}
            required
            pattern="^[A-Za-z\s]+$"
            title="Job title should only contain alphabets and spaces."
          />
          {errors.jobTitle && <p className="error">{errors.jobTitle}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="employmentStatus">Employment Status:</label>
          <select id="employmentStatus" name="employmentStatus" value={formData.employmentStatus} onChange={handleChange} required>
            <option value="">Select Employment Status</option>
            <option value="Employed">Employed</option>
            <option value="Self-Employed">Self-Employed</option>
            <option value="Unemployed">Unemployed</option>
            <option value="Student">Student</option>
            <option value="Retired">Retired</option>
            <option value="Homemaker">Homemaker</option>
            <option value="Other">Other</option>
          </select>
          {errors.employmentStatus && <p className="error">{errors.employmentStatus}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="state">State:</label>
          <select id="state" name="state" value={formData.state} onChange={handleChange} required>
            <option value="">Select your state</option>
            {/* Add state options here */}
            <option value="Andhra Pradesh">Andhra Pradesh</option>
            <option value="Arunachal Pradesh">Arunachal Pradesh</option>
            <option value="Assam">Assam</option>
            <option value="Bihar">Bihar</option>
            <option value="Chhattisgarh">Chhattisgarh</option>
            <option value="Goa">Goa</option>
            <option value="Gujarat">Gujarat</option>
            <option value="Haryana">Haryana</option>
            <option value="Himachal Pradesh">Himachal Pradesh</option>
            <option value="Jharkhand">Jharkhand</option>
            <option value="Karnataka">Karnataka</option>
            <option value="Kerala">Kerala</option>
            <option value="Madhya Pradesh">Madhya Pradesh</option>
            <option value="Maharashtra">Maharashtra</option>
            <option value="Manipur">Manipur</option>
            <option value="Meghalaya">Meghalaya</option>
            <option value="Mizoram">Mizoram</option>
            <option value="Nagaland">Nagaland</option>
            <option value="Odisha">Odisha</option>
            <option value="Punjab">Punjab</option>
            <option value="Rajasthan">Rajasthan</option>
            <option value="Sikkim">Sikkim</option>
            <option value="Tamil Nadu">Tamil Nadu</option>
            <option value="Telangana">Telangana</option>
            <option value="Tripura">Tripura</option>
            <option value="Uttar Pradesh">Uttar Pradesh</option>
            <option value="Uttarakhand">Uttarakhand</option>
            <option value="West Bengal">West Bengal</option>
            <option value="Andaman and Nicobar Islands">Andaman and Nicobar Islands</option>
            <option value="Chandigarh">Chandigarh</option>
            <option value="Dadra and Nagar Haveli and Daman and Diu">Dadra and Nagar Haveli and Daman and Diu</option>
            <option value="Lakshadweep">Lakshadweep</option>
            <option value="Delhi">Delhi</option>
            <option value="Puducherry">Puducherry</option>
            <option value="Ladakh">Ladakh</option>
            <option value="Jammu and Kashmir">Jammu and Kashmir</option>
            {/* More states */}
          </select>
          {errors.state && <p className="error">{errors.state}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="city">City:</label>
          <input
            type="text"
            id="city"
            name="city"
            value={formData.city}
            onChange={handleChange}
            required
            pattern="^[A-Za-z\s]+$"
            title="City should only contain alphabets and spaces."
          />
          {errors.city && <p className="error">{errors.city}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="zip">Zip Code:</label>
          <input
            type="text"
            id="zip"
            name="zip"
            value={formData.zip}
            onChange={handleChange}
            required
            pattern="^\d{5,6}$"
            title="Zip code should be a 5 or 6-digit number."
          />
          {errors.zip && <p className="error">{errors.zip}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="phoneNumber">Phone Number:</label>
          <input
            type="text"
            id="phoneNumber"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
            pattern="^\d{10}$"
            title="Phone number should be a 10-digit number."
          />
          {errors.phoneNumber && <p className="error">{errors.phoneNumber}</p>}
        </div>
        <div className="form-group">
        <label htmlFor="panNumber">Pan Number:</label>
        <input
          type="text"
          id="panNumber"
          name="panNumber"
          value={formData.panNumber}
          onChange={handleChange}
          required
          pattern="^[A-Z]{5}[0-9]{4}[A-Z]$"
          title="PAN Number should be in the format: 5 letters, 4 digits, 1 letter (e.g., ABCDE1234F)."
        />
        {errors.panNumber && <p className="error">{errors.panNumber}</p>}
      </div>
        <div className="form-group">
          <label htmlFor="streetAddress">Street Address:</label>
          <input type="text" id="streetAddress" name="streetAddress" value={formData.streetAddress} onChange={handleChange} required />
          {errors.streetAddress && <p className="error">{errors.streetAddress}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="country">Country:</label>
          <input
            type="text"
            id="country"
            name="country"
            value={formData.country}
            onChange={handleChange}
            required
            pattern="^[A-Za-z]+$"
            title="country should only contain alphabets."
          />
          {errors.country && <p className="error">{errors.country}</p>}
        </div>
        <div className="form-group">
          <label>
            <input type="checkbox" name="emailNotifications" checked={formData.emailNotifications} onChange={handleChange} />
            Receive Email Notifications
          </label>
        </div>
        <div className="form-group">
          <label>
            <input type="checkbox" name="smsNotifications" checked={formData.smsNotifications} onChange={handleChange} />
            Receive SMS Notifications
          </label>
        </div>
        <div className="form-group">
          <label htmlFor="preferredContactMethod">Preferred Contact Method:</label>
          <select id="preferredContactMethod" name="preferredContactMethod" value={formData.preferredContactMethod} onChange={handleChange} required>
            <option value="email">Email</option>
            <option value="phone">Phone</option>
            <option value="sms">SMS</option>
          </select>
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default UserRegistrationForm;