import React from 'react';
import { Link } from 'react-router-dom';

const Assets = ({ assets }) => {
  return (
    <div className="assets-grid">
      {assets.map(asset => (
        <Link
          to={
            asset.name === 'Indian Stocks' ? '/indian-stocks'
            : asset.name === 'US Stocks' ? '/us-stocks'
            : asset.name === 'Fixed Deposits' ? '/fd'
            : asset.name === 'Bonds' ? '/bonds'
            : `/assets/${asset.id}`
          }
          key={asset.id}
          className="asset-card-link"
        >
          <div className="asset-card">
            <i className={`asset-icon fas ${asset.icon}`} />
            <h3>{asset.name}</h3>
            <div className="value">
              {asset.name === 'US Stocks' ? '$' : '₹'}
              {asset.value.toFixed(2)}
            </div>
            {asset.name !== 'Fixed Deposits' && asset.name !== 'Bonds' && (
              <div className="change">Change: {asset.change.toFixed(2)}%</div>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
};

export default Assets;
