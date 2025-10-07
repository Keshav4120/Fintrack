import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/UserDashboard.css";

const UserDashboard = () => {
  const [bonds, setBonds] = useState([]);
  const [selectedBond, setSelectedBond] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [purchases, setPurchases] = useState([]);
  const [filter, setFilter] = useState("");
  const [sortCriteria, setSortCriteria] = useState("price");
  const [loading, setLoading] = useState(false);
  const [purchaseHistoryVisible, setPurchaseHistoryVisible] = useState(false);

  // Fetch bonds on component mount
  useEffect(() => {
    const fetchBonds = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://localhost:3001/api/bonds");
        const bondsWithMaturity = response.data.map((bond) => {
          const maturityDuration = calculateMaturityDuration(bond.maturityDate);
          return { ...bond, maturityDuration };
        });
        setBonds(bondsWithMaturity);
      } catch (error) {
        console.error("Error fetching bonds:", error);
        alert("Failed to fetch bond data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchBonds();
  }, []);

  // Calculate maturity duration
  const calculateMaturityDuration = (maturityDate) => {
    if (!maturityDate) return { years: 0, months: 0 };

    const currentDate = new Date();
    const bondMaturityDate = new Date(maturityDate);

    if (isNaN(bondMaturityDate)) return { years: 0, months: 0 };

    const totalMonths =
      bondMaturityDate.getFullYear() * 12 +
      bondMaturityDate.getMonth() -
      (currentDate.getFullYear() * 12 + currentDate.getMonth());

    const years = Math.floor(totalMonths / 12);
    const months = totalMonths % 12;

    return { years, months };
  };

  // Handle bond purchase
  const handlePurchase = async () => {
    if (!selectedBond) {
      alert("Select a bond first!");
      return;
    }

    const quantityInt = parseInt(quantity, 10);
    if (isNaN(quantityInt) || quantityInt <= 0) {
      alert("Enter a valid quantity greater than 0!");
      return;
    }

    setLoading(true);

    try {
      await axios.post(
        "http://localhost:3001/api/purchases",
        {
          bondName: selectedBond.name,
          quantity: quantityInt,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      alert("Purchase successful!");
      setSelectedBond(null);
      setQuantity(1);
      fetchPurchases();
    } catch (error) {
      console.error("Error purchasing bond:", error);
      alert(
        error.response?.data?.message ||
          "Failed to complete the purchase. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Fetch purchases
  const fetchPurchases = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:3001/api/purchases", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setPurchases(response.data);
    } catch (error) {
      console.error("Error fetching purchases:", error);
      alert("Failed to fetch purchase history.");
    } finally {
      setLoading(false);
    }
  };

  // Toggle Purchase History visibility
  const togglePurchaseHistory = () => {
    setPurchaseHistoryVisible((prev) => !prev);
    if (!purchaseHistoryVisible) {
      fetchPurchases();
    }
  };

  // Filter and sort bonds
  const filteredBonds = bonds
    .filter((bond) => bond.name.toLowerCase().includes(filter.toLowerCase()))
    .sort((a, b) => {
      if (sortCriteria === "price") return a.price - b.price;
      if (sortCriteria === "yield")
        return parseFloat(b.yieldToMaturity) - parseFloat(a.yieldToMaturity);
      if (sortCriteria === "rating") return a.rating.localeCompare(b.rating);
      return 0;
    });

  return (
    <div className="user-dashboard">
      <h1>User Dashboard</h1>

      {loading && <div className="loader">Loading...</div>}

      {!selectedBond ? (
        <>
          <div className="filters">
            <input
              type="text"
              placeholder="Search bonds by name"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
            <select
              value={sortCriteria}
              onChange={(e) => setSortCriteria(e.target.value)}
            >
              <option value="price">Sort by Price</option>
              <option value="yield">Sort by Yield</option>
              <option value="rating">Sort by Rating</option>
            </select>
          </div>

          <div className="bond-list">
            {filteredBonds.map((bond) => (
              <div key={bond.id} className="bond-card">
                <h3>{bond.name}</h3>
                <p>Coupon Rate: {bond.couponRate}</p>
                <p>Type: {bond.type}</p>
                <p>Price: ₹{bond.price.toLocaleString()}</p>
                <button onClick={() => setSelectedBond(bond)}>Select</button>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="bond-details">
          <h3>{selectedBond.name}</h3>
          <p>Type: {selectedBond.type || "N/A"}</p>
          <p>Coupon Rate: {selectedBond.couponRate || "N/A"}</p>
          <p>Price: ₹{selectedBond.price.toLocaleString() || "N/A"}</p>
          <p>Rating: {selectedBond.rating || "N/A"}</p>
          <p>
            Interest Payment Frequency:{" "}
            {selectedBond.interestPaymentFrequency || "N/A"}
          </p>
          <p>
            Maturity Duration:{" "}
            {`${selectedBond.maturityDuration?.years || 0} years ${
              selectedBond.maturityDuration?.months || 0
            } months`}
          </p>

          <div className="purchase">
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
            <button onClick={handlePurchase} disabled={loading}>
              {loading ? "Purchasing..." : "Purchase"}
            </button>
          </div>
          <button onClick={() => setSelectedBond(null)}>Back</button>
        </div>
      )}

      <button onClick={togglePurchaseHistory}>
        {purchaseHistoryVisible ? "Hide Purchase History" : "Show Purchase History"}
      </button>

      {purchaseHistoryVisible && (
        <div className="purchase-history">
          <h3>Your Purchase History</h3>
          <ul>
            {purchases.map((purchase, index) => (
              <li key={index}>
                <p>{purchase.bondName}</p>
                <p>Quantity: {purchase.quantity}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
