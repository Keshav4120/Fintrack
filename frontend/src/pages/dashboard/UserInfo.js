import React from 'react';
// import '../styles/dashboard.css'; // Import the CSS file

export default function UserInfo({ users }) {
    console.log(users);
  return (
    <div className="user-list">
      {Object.keys(users).map((key) => (
        <div className="user-card" key={key}>
          <h2>{users[key].Name} {users[key].surname}</h2>
          <p><strong>Job Title:</strong> {users[key].jobTitle}</p>
          <p><strong>Employment Status:</strong> {users[key].employmentStatus}</p>
          <p><strong>Location:</strong> {users[key].city}, {users[key].state}, {users[key].zip}, {users[key].country}</p>
          <p><strong>Street Address:</strong> {users[key].streetAddress}</p>
          <p><strong>Phone Number:</strong> {users[key].phoneNumber}</p>
          <p><strong>Contact Number:</strong> {users[key].contactNumber}</p>
          <p><strong>Preferred Contact Method:</strong> {users[key].preferredContactMethod}</p>
          <p><strong>Email Notifications:</strong> {users[key].emailNotifications ? 'Yes' : 'No'}</p>
          <p><strong>SMS Notifications:</strong> {users[key].smsNotifications ? 'Yes' : 'No'}</p>
        </div>
      ))}
    </div>
  );
}
