import { useState, useEffect } from 'react';

export function useStockData() {
  const [indianStocksTotal, setIndianStocksTotal] = useState(0);
  const [usStocksTotal, setUSStocksTotal] = useState(0);

  useEffect(() => {
    const fetchIndianStocksTotal = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/stocks/indian');
        const data = await response.json();
        const currentTotalValue = data.reduce((sum, stock) => sum + parseFloat(stock.currentvalue), 0);
        const investedValue = data.reduce((sum, stock) => sum + (parseFloat(stock.units) * parseFloat(stock.avgbuyprice)), 0);
        const returnValue = currentTotalValue - investedValue;
        const totalInvestment = investedValue + returnValue;

        setIndianStocksTotal(parseFloat(totalInvestment.toFixed(2)));
      } catch (error) {
        console.error('Error fetching Indian stock data:', error);
      }
    };

    fetchIndianStocksTotal();
  }, []);

  useEffect(() => {
    const fetchUSStocksTotal = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/stocks/us');
        const data = await response.json();
        const currentTotalValue = data.reduce((sum, stock) => sum + parseFloat(stock.currentvalue), 0);
        const investedValue = data.reduce((sum, stock) => sum + (parseFloat(stock.units) * parseFloat(stock.avgbuyprice)), 0);
        const returnValue = currentTotalValue - investedValue;
        const totalInvestment = investedValue + returnValue;

        setUSStocksTotal(parseFloat(totalInvestment.toFixed(2)));
      } catch (error) {
        console.error('Error fetching US stock data:', error);
      }
    };

    fetchUSStocksTotal();
  }, []);

  return { indianStocksTotal, usStocksTotal };
}
