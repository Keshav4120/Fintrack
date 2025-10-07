import React, { useEffect, useState } from 'react';
import '../styles/dashboard.css';
import UserInfo from './UserInfo';

const Dashboard = () => {
  const [usernames, setUsernames] = useState([]);

  useEffect(() => {
    const fetchUsernames = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/usernames');
        const data = await response.json();
        setUsernames(data);
      } catch (error) {
        console.error('Error fetching usernames:', error);
      }
    };

    fetchUsernames();
  }, []);

  return (
    <div className="main--content">
      <div className="header--wrapper">
        <div className="header--title">
          <span>Primary</span>
          <h2>Dashboard</h2>
        </div>
        
      </div>
      <div className="user--info">
          <UserInfo users={usernames}/>
        </div>
      <div className="help-support-container">
        <h3>Help and Support</h3>
        <ul className="questions-list">
          <li>
            <div className="question">
              <h4>How do I update my account information?</h4>
            </div>
            <div className="answer">
              <p>To update your account information, go to the Profile section and click on the edit button next to the relevant field.</p>
            </div>
          </li>
          <li>
            <div className="question">
              <h4>What should I do if I forget my password?</h4>
            </div>
            <div className="answer">
              <p>If you forget your password, you can use the 'Forgot Password' option on the login page to reset it.</p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
