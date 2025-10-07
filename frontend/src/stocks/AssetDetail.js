import React from 'react';
import { useParams } from 'react-router-dom';

const AssetDetail = ({ assets }) => {
  const { id } = useParams();
  const asset = assets.find(a => a.id === parseInt(id));

  if (!asset) {
    return <div>Asset not found</div>;
  }

  return (
    <div className="asset-detail">
      <h1>{asset.name}</h1>
      <i className={`asset-icon fas ${asset.icon}`} />
      <div className="value">₹{asset.value.toFixed(2)}</div>
      <div className="change">Change: {asset.change.toFixed(2)}%</div>
      <p>Details about {asset.name} will be displayed here.</p>
    </div>
  );
};

export default AssetDetail;
