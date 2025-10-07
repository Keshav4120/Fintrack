import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartLine, faHandHoldingUsd, faPiggyBank, faCoins, faCertificate, faDollarSign } from '@fortawesome/free-solid-svg-icons';

// Map the icon names to their respective FontAwesome icons
const iconMapping = {
  'fa-chart-line': faChartLine,
  'fa-hand-holding-usd': faHandHoldingUsd,
  'fa-piggy-bank': faPiggyBank,
  'fa-coins': faCoins, // Updated icon for Gold
  'fa-certificate': faCertificate, // Icon for Bonds
  'fa-dollar-sign': faDollarSign // Dollar icon for US Stocks
};

const AssetCard = ({ name, value, change, icon }) => {
  const shouldDisplayChange = !['Fixed Deposits', 'Bonds'].includes(name);

  return (
    <div className="asset-card">
      <div className="asset-icon">
        <FontAwesomeIcon icon={iconMapping[icon]} size="2x" />
      </div>
      <h3>{name}</h3>
      <div className="value">₹{value.toLocaleString('en-IN')}K</div>
      {shouldDisplayChange && (
        <div className="change">+{change.toFixed(2)}%</div>
      )}
    </div>
  );
};

export default AssetCard;
