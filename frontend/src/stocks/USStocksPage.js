import React, { useState, useEffect } from "react";
import Select from "react-select";
import USStocksDashboard from "./USStocksDashboard";
import StockDisplay from "./StockDisplay";
import Chatbot from "./components/Chatbot";
import "./EditButton.css";
import usCompanies from "./data/usCompanies";

function USStocksPage({ setUSStocksTotal }) {
  const [stocks, setStocks] = useState([]);
  const [dashboardData, setDashboardData] = useState({
    totalInvestment: 0,
    dayChange: 0,
    invested: 0,
    return: 0,
    returnPercentage: 0,
  });
  const [showStocks, setShowStocks] = useState(false);
  const [editMode, setEditMode] = useState(""); // Determines the current mode: "add", "modify", "delete", or ""
  const [editOptionsVisible, setEditOptionsVisible] = useState(false);
  const [selectedStock, setSelectedStock] = useState(null);
  const [newStock, setNewStock] = useState({
    name: "",
    symbol: "",
    sector: "",
    units: "",
    avgbuyprice: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const hasFetchedStocks = localStorage.getItem("showUSStocks");
    if (hasFetchedStocks) {
      setShowStocks(true);
      fetchStocks();
    }
  }, []);

  const calculateDashboardData = (formattedStocks) => {
    const currentTotalValue = formattedStocks.reduce(
      (sum, stock) => sum + stock.currentvalue,
      0
    );
    const investedValue = formattedStocks.reduce(
      (sum, stock) => sum + stock.units * stock.avgbuyprice,
      0
    );
    const returnValue = currentTotalValue - investedValue;
    const returnPercentage = (returnValue / investedValue) * 100;

    return {
      totalInvestment: parseFloat(currentTotalValue.toFixed(2)),
      dayChange: 0,
      invested: parseFloat(investedValue.toFixed(2)),
      return: parseFloat(returnValue.toFixed(2)),
      returnPercentage: parseFloat(returnPercentage.toFixed(2)),
    };
  };

  const fetchStocks = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:3001/api/stocks/us");
      const data = await response.json();

      const formattedStocks = data.map((stock) => ({
        id: stock.id,
        name: stock.name,
        sector: stock.sector,
        livePrice: parseFloat(stock.liveprice),
        units: parseFloat(stock.units),
        avgbuyprice: parseFloat(stock.avgbuyprice),
        currentvalue: parseFloat(stock.currentvalue),
        change: parseFloat(stock.change),
      }));

      setStocks(formattedStocks);
      setDashboardData(calculateDashboardData(formattedStocks));
      setUSStocksTotal(
        formattedStocks.reduce((sum, stock) => sum + stock.currentvalue, 0)
      );
    } catch (error) {
      console.error("Error fetching stock data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFetchStocks = () => {
    setShowStocks(true);
    localStorage.setItem("showUSStocks", "true");
    fetchStocks();
  };

  const handleAddStock = async () => {
    if (
      !newStock.name ||
      !newStock.symbol ||
      !newStock.sector ||
      !newStock.units ||
      !newStock.avgbuyprice
    ) {
      alert("All fields are required to add a stock.");
      return;
    }

    const stockToAdd = {
      ...newStock,
      units: parseFloat(newStock.units),
      avgbuyprice: parseFloat(newStock.avgbuyprice),
    };

    setLoading(true);
    try {
      const response = await fetch("http://localhost:3001/api/stocks/us", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(stockToAdd),
      });
      if (response.ok) {
        setNewStock({
          name: "",
          symbol: "",
          sector: "",
          units: "",
          avgbuyprice: "",
        });
        fetchStocks();
        setEditMode("");
        setEditOptionsVisible(false);
      }
    } catch (error) {
      console.error("Error adding stock:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleModifyStock = async () => {
    if (!selectedStock) {
      alert("Please select a stock to modify.");
      return;
    }

    const stockToModify = {
      ...selectedStock,
      units: parseFloat(selectedStock.units),
      avgbuyprice: parseFloat(selectedStock.avgbuyprice),
    };


    setLoading(true);
    console.log("Stock to modify:", selectedStock);
    console.log("Payload being sent:", stockToModify);
    try {
      const response = await fetch(
        `http://localhost:3001/api/stocks/us/${stockToModify.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(stockToModify),
        }
      );

      if (response.ok) {
        fetchStocks(); // Re-fetch stocks to update the list
        setEditMode("");
        setEditOptionsVisible(false);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to modify stock.");
      }
    } catch (error) {
      console.error("Error modifying stock:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteStock = async (id) => {
    if (!window.confirm("Are you sure you want to delete this stock?")) {
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3001/api/stocks/us/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        fetchStocks();
        setEditMode("");
        setEditOptionsVisible(false);
      }
    } catch (error) {
      console.error("Error deleting stock:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (editMode === "modify" && selectedStock) {
      setNewStock({
        name: selectedStock.name,
        symbol: selectedStock.symbol,
        sector: selectedStock.sector,
        units: selectedStock.units,
        avgbuyprice: selectedStock.avgbuyprice,
      });
    }
  }, [editMode, selectedStock]);

  const options = usCompanies.map((company) => ({
    label: company.name,
    value: company.symbol,
  }));

  return (
    <div className="container">
      <USStocksDashboard stockData={dashboardData} />
      {!showStocks ? (
        <div className="track-investments-container">
          <p className="track-investments-message">Do you want to fetch your US investments?</p>
          <button className="track-investments-button" onClick={handleFetchStocks}>
            Track Your Investments
          </button>
        </div>
      ): (
        <>
      {!editOptionsVisible && (
        <button className="edit-button" onClick={() => setEditOptionsVisible(true)}>
          Edit Stock
        </button>
      )}
      {editOptionsVisible && (
        <div className="edit-options">
          <button onClick={() => setEditMode("add")}>Add Stock</button>
          <button onClick={() => setEditMode("modify")}>Modify Stock</button>
          <button onClick={() => setEditMode("delete")}>Delete Stock</button>
          <button onClick={() => setEditOptionsVisible(false)}>Cancel</button>
        </div>
      )}
      {editMode === "modify" && (
        <div className="edit-modal">
          <h3>Modify Stock</h3>
          <select
            value={selectedStock?.id || ""}
            onChange={(e) => {
              const stockId = parseInt(e.target.value, 10);
              const stock = stocks.find((s) => s.id === stockId);
              setSelectedStock(stock || null);
            }}
          >
            <option value="">Select a stock to modify</option>
            {stocks.map((stock) => (
              <option key={stock.id} value={stock.id}>
                {stock.name}
              </option>
            ))}
          </select>
          {selectedStock && (
            <>
              <input
                type="number"
                placeholder="Units"
                value={selectedStock.units}
                onChange={(e) =>
                  setSelectedStock({
                    ...selectedStock,
                    units: e.target.value,
                  })
                }
              />
              <input
                type="number"
                placeholder="Average Buy Price"
                value={selectedStock.avgbuyprice}
                onChange={(e) =>
                  setSelectedStock({
                    ...selectedStock,
                    avgbuyprice: e.target.value,
                  })
                }
              />
              <button onClick={handleModifyStock} disabled={loading}>
                {loading ? "Modifying..." : "Modify"}
              </button>
            </>
          )}
          <button onClick={() => setEditMode("")}>Cancel</button>
        </div>
      )}
      {editMode === "delete" && (
        <div className="edit-modal">
          <h3>Delete Stock</h3>
          <select
            value={selectedStock?.id || ""}
            onChange={(e) => {
              const stockId = parseInt(e.target.value, 10);
              const stock = stocks.find((s) => s.id === stockId);
              setSelectedStock(stock || null);
            }}
          >
            <option value="">Select a stock to delete</option>
            {stocks.map((stock) => (
              <option key={stock.id} value={stock.id}>
                {stock.name}
              </option>
            ))}
          </select>
          {selectedStock && (
            <>
              <p>Are you sure you want to delete {selectedStock.name}?</p>
              <button
                onClick={() => handleDeleteStock(selectedStock.id)}
                disabled={loading}
              >
                {loading ? "Deleting..." : "Delete"}
              </button>
            </>
          )}
          <button onClick={() => setEditMode("")}>Cancel</button>
        </div>
      )}
      {editMode === "add" && (
        <div className="edit-modal">
          <h3>Add New Stock</h3>
          <Select
            options={options}
            value={newStock.name ? { label: newStock.name, value: newStock.symbol } : null}
            onChange={(selectedOption) => {
              const selectedCompany = usCompanies.find(
                (company) => company.symbol === selectedOption.value
              );
              if (selectedCompany) {
                setNewStock({
                  name: selectedCompany.name,
                  symbol: selectedCompany.symbol,
                  sector: selectedCompany.sector,
                  units: newStock.units,
                  avgbuyprice: newStock.avgbuyprice,
                });
              }
            }}
            placeholder="Search and Select Company"
            styles={{
              container: (provided) => ({
                ...provided,
                marginBottom: "15px",
              }),
            }}
          />

          <input
            type="text"
            placeholder="Symbol"
            value={newStock.symbol}
            disabled
          />
          
          <input
            type="text"
            placeholder="Sector"
            value={newStock.sector}
            disabled
          />

          <input
            type="number"
            placeholder="Units"
            value={newStock.units}
            onChange={(e) =>
              setNewStock({ ...newStock, units: e.target.value })
            }
          />
          <input
            type="number"
            placeholder="Average Buy Price"
            value={newStock.avgbuyprice}
            onChange={(e) =>
              setNewStock({ ...newStock, avgbuyprice: e.target.value })
            }
          />
          <button onClick={handleAddStock} disabled={loading}>
            {loading ? "Adding..." : "Add"}
          </button>
          <button onClick={() => setEditMode("")}>Cancel</button>
        </div>
      )}
      <StockDisplay stocks={stocks} currency="$" />
      <Chatbot />
      </>
      )}
    </div>
  );
}

export default USStocksPage;