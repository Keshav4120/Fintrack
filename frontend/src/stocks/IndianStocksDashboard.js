import React from 'react';
import './IndianStocksDashboard.css';

function IndianStocksDashboard({ stockData }) {
  const isPositive = stockData.returnPercentage >= 0;

  return (
    <div className="indian-stocks-dashboard">
      <div className="total-value">
        <h1>₹{stockData.totalInvestment.toLocaleString()}</h1>
        <p className="day-change" style={{ color: isPositive ? '#45c49b' : '#f05454' }}>
        </p>
      </div>
      <div className="dashboard-stats">
        <div className="stat">
          <p>Invested Value</p>
          <h2>₹{stockData.invested.toLocaleString()}</h2>
        </div>
        <div className="stat">
          <p>Current Return</p>
          <h2>₹{stockData.return.toLocaleString()}</h2>
        </div>
        <div className="stat">
          <p>Current Return %</p>
          <h2 style={{ color: isPositive ? '#45c49b' : '#f05454' }}>
            {isPositive ? '▲' : '▼'} {stockData.returnPercentage}%
          </h2>
        </div>
      </div>
    </div>
  );
}

export default IndianStocksDashboard;
