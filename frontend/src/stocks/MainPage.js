import React, { useState, useEffect } from 'react';
import DashboardHeader from './DashboardHeader';
import Assets from './Assets';
import TickerTapeWidget from './TickerTapeWidget';
import Loan from './Loan';
import { useStockData } from './useStockData';

function MainPage() {
  const { indianStocksTotal, usStocksTotal } = useStockData();
  const [assets, setAssets] = useState([]);
  const [totalAssets, setTotalAssets] = useState(0);
  const [niftyValue, setNiftyValue] = useState(0);

  useEffect(() => {
    const fetchedAssets = [
      { id: 1, name: 'Indian Stocks', value: indianStocksTotal, change: 0.29, icon: 'fa-chart-line' },
      { id: 2, name: 'US Stocks', value: usStocksTotal, change: 0.12, icon: 'fa-dollar-sign' },
      { id: 3, name: 'Mutual Funds', value: 300.32, change: 0.1, icon: 'fa-piggy-bank' },
      { id: 4, name: 'Fixed Deposits', value: 300.32, change: 0.1, icon: 'fa-hand-holding-usd' },
      { id: 5, name: 'Gold', value: 300.32, change: 0.1, icon: 'fa-coins' },
      { id: 6, name: 'Bonds', value: 300.32, change: 0.1, icon: 'fa-certificate' },
    ];

    fetchedAssets[0].value = indianStocksTotal;
    fetchedAssets[1].value = usStocksTotal;

    setAssets(fetchedAssets);

    // Calculate total assets and convert US Stocks to INR (multiplied by 85)
    const total = fetchedAssets.reduce((acc, asset) => {
      if (asset.name === 'US Stocks') {
        return acc + asset.value * 85;
      }
      return acc + asset.value;
    }, 0);

    setTotalAssets(total);

    setNiftyValue(0.29); // Assuming this is fetched or static
  }, [indianStocksTotal, usStocksTotal]);

  return (
    <div className='container'>
      <DashboardHeader totalAssets={totalAssets} niftyValue={niftyValue} />
      <TickerTapeWidget />
      <div className="assets-box">
        <h2 className="assets-title">Assets</h2>
        <Assets assets={assets} />
      </div>
      <Loan />
    </div>
  );
}

export default MainPage;
