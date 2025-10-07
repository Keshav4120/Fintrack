import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ChatBot from 'react-simple-chatbot';
import { ThemeProvider } from 'styled-components';
import './FDComponent.css';
import { FaCommentAlt } from 'react-icons/fa'; // Chatbot icon
import { FaTimes } from 'react-icons/fa'; // Close button
import qrImage from './qr.png';
import healthInsuranceCard from './health-insurance-card.png'; // Corrected import for health insurance card image

const FDComponent = () => {
  const [expanded, setExpanded] = useState(false);
  const [investment, setInvestment] = useState('');
  const [fdData, setFdData] = useState([]);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [showChat, setShowChat] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false); // Show QR code state
  const [showPaymentButton, setShowPaymentButton] = useState(false); // Show payment button state
  const [showHealthCard, setShowHealthCard] = useState(false); // Show Health Insurance Card state

  const navigate = useNavigate();

  // Fetch FD data
  useEffect(() => {
    const fetchFdData = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/fds');
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Network response was not ok: ${errorText}`);
        }
        const data = await response.json();
        setFdData(data);
      } catch (error) {
        console.error('Error fetching FD data:', error);
      }
    };

    fetchFdData();
  }, []);

  const handleCardClick = () => setExpanded(!expanded);

  const handleInvestmentChange = (e) => setInvestment(e.target.value);

  const handleEmailChange = (e) => setEmail(e.target.value);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch('http://localhost:3001/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    })
      .then((response) => response.json())
      .then((data) => {
        setMessage(data.message || 'Email sent successfully!');
      })
      .catch((error) => {
        setMessage('An error occurred: ' + error.message);
      });
  };

  const calculateReturn = (amount, fd) => {
    if (!fd || !amount || isNaN(amount) || amount < fd.minInvestment) return 0;
    const interestRate = fd.interest / 100;
    return amount * (1 + (interestRate * fd.tenure) / 12);
  };

  const handleBuy = (fd, e) => {
    e.stopPropagation();
    alert(`You have purchased the Fixed Deposit: ${fd.name} with an investment of ₹${investment}`);
    setShowQRCode(true); // Show QR code
    setShowPaymentButton(true); // Show "Done Payment" button
  };

  const handleDonePayment = () => {
    setShowHealthCard(true); // Show health card when payment is done
  };

  const handleSell = (fd, e) => {
    e.stopPropagation();
    alert(`You have sold the Fixed Deposit: ${fd.name}`);
  };

  const steps = [
    {
      id: '1',
      message: 'Welcome to Fixed Deposit Assistant! How can I assist you today?',
      trigger: '2',
    },
    {
      id: '2',
      options: [
        { value: 'fd_info', label: 'Tell me about Fixed Deposits', trigger: '3' },
        { value: 'calc_return', label: 'How to calculate returns?', trigger: '4' },
        { value: 'email_info', label: 'How can I get FD details emailed?', trigger: '5' },
      ],
    },
    {
      id: '3',
      message:
        'Fixed Deposits are a safe investment option offering guaranteed returns. You can choose a tenure and invest a minimum amount as specified by the bank.',
      trigger: '6',
    },
    {
      id: '4',
      message:
        'Returns are calculated using the formula: Return = P x (1 + (r x t) / 12), where P is principal, r is interest rate (decimal), and t is tenure in months.',
      trigger: '6',
    },
    {
      id: '5',
      message:
        'You can enter your email in the form provided on the page and click "Send Email" to receive all FD details.',
      trigger: '6',
    },
    {
      id: '6',
      message: 'Would you like to ask anything else?',
      trigger: '2',
    },
  ];

  const theme = {
    background: '#f5f8fb',
    fontFamily: 'Arial, Helvetica, sans-serif',
    headerBgColor: '#00bcd4',
    headerFontColor: '#fff',
    headerFontSize: '15px',
    botBubbleColor: '#00bcd4',
    botFontColor: '#fff',
    userBubbleColor: '#fff',
    userFontColor: '#4a4a4a',
  };

  return (
    <div className="fd-container">
      <h1 className="dashboard">Fixed Deposits</h1>

      {fdData.length > 0 ? (
        fdData.map((fd, index) => (
          <div
            key={index}
            className={`fd-row ${expanded ? 'expanded' : ''}`}
            onClick={handleCardClick}
          >
            <div className="fd-column">
              <h2>{fd.name}</h2>
              <p>Tenure: {fd.tenure} months</p>
              <p>Interest Rate: {fd.interest}%</p>
            </div>
            <div className="fd-column">
              <p>Minimum Investment: ₹{fd.minInvestment}</p>
              <label>Amount to Invest:</label>
              <input
                type="number"
                value={investment}
                onChange={handleInvestmentChange}
                min={fd.minInvestment}
              />
            </div>
            <div className="fd-column">
              <p>Estimated Return: ₹{calculateReturn(investment, fd).toFixed(2)}</p>
            </div>
            <div className="fd-column">
              <button className="buy-button" onClick={(e) => handleBuy(fd, e)}>
                Buy
              </button>
              <button className="sell-button" onClick={(e) => handleSell(fd, e)}>
                Sell
              </button>
            </div>
          </div>
        ))
      ) : (
        <p>Loading FD data...</p>
      )}

      <form onSubmit={handleSubmit} className="email-form">
        <label>
          Enter your email to receive FD information:
          <input
            type="email"
            value={email}
            onChange={handleEmailChange}
            required
          />
        </label>
        <button type="submit">Send Email</button>
      </form>

      {message && <p>{message}</p>}

      {/* Show QR code and Done Payment button after Buy button is clicked */}
      {showQRCode && (
        <div className="qr-code-container">
          <h2>Scan this QR code for your purchase details!</h2>
          <img src={qrImage} alt="QR Code" className="qr-image" />
          
          {/* Link to Google Drive */}
          <a
            href="https://drive.google.com/file/d/1Ep9paGjBbHDVV8rmBINCIqKDpPwV0y2B/view?usp=sharing"
            target="_blank"
            rel="noopener noreferrer"
            className="qr-link"
          >
            Click here
          </a>
          
          {showPaymentButton && (
            <button onClick={handleDonePayment} className="done-payment-button">
              Done Payment
            </button>
          )}
        </div>
      )}

      {/* Show Health Insurance Card after payment */}
      {showHealthCard && (
        <div className="health-card-container">
          <h2>Congratulations! You're eligible for a Health Insurance Card.</h2>
          <img
            src={healthInsuranceCard} // Correct usage of imported image
            alt="Health Insurance Card"
            className="health-card-image"
          />
          <a
            href={healthInsuranceCard} // Correct usage of download link
            className="download-link"
            download
          >
            Download your card
          </a>
        </div>
      )}

      <button
        className="chatbot-toggle-button"
        onClick={() => setShowChat(!showChat)}
      >
        <FaCommentAlt /> {showChat ? 'Close' : 'Chat'}
      </button>

      {showChat && (
        <ThemeProvider theme={theme}>
          <ChatBot steps={steps} />
        </ThemeProvider>
      )}
    </div>
  );
};

export default FDComponent;
