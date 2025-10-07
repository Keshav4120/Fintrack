import React from 'react';
import './StockDisplay.css';

function StockDisplay({ stocks, currency }) {
  return (
    <div className="stock-display">
      {stocks.map((stock, index) => (
        <div key={index} className="stock-card">
          <div className="stock-info">
            <h2>{stock.name}</h2>
            <p>{stock.sector}</p>
          </div>
          <div className="stock-details">
            <div className="stock-detail">
              <p>Live Price</p>
              <h3>{currency}{stock.livePrice}</h3>
            </div>
            <div className="stock-detail">
              <p>Units</p>
              <h3>{stock.units}</h3>
            </div>
            <div className="stock-detail">
              <p>Avg. Buy Price</p>
              <h3>{currency}{stock.avgbuyprice !== undefined ? stock.currentvalue.toFixed(2) : '0.00'}</h3>
            </div>
            <div className="stock-detail">
              <p>Current Value</p>
              <h3>{currency}{stock.currentvalue !== undefined ? stock.currentvalue.toFixed(2) : '0.00'}</h3>
              <p style={{ color: stock.change >= 0 ? '#45c49b' : '#f05454' }}>
              {stock.change >= 0 ? '▲' : '▼'} {stock.change !== undefined ? stock.change.toFixed(2) : '0.00'}%
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default StockDisplay;
