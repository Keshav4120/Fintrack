import React from 'react';

const DashboardHeader = ({ totalAssets, niftyValue }) => {
  return (
    <div className="dashboard-header">
      <div>Total Assets</div>
      <div className="total-assets">₹{totalAssets.toLocaleString('en-IN')}K</div>
      {/* <div className="nifty">Nifty 50: +{niftyValue.toFixed(2)}%</div> */}

    </div>
  );
};

export default DashboardHeader;
