import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/AdminDashboard.css";

const AdminDashboard = () => {
  const [bonds, setBonds] = useState([]);
  const [userInvestments, setUserInvestments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [bondDetails, setBondDetails] = useState({
    name: "",
    type: "",
    couponRate: "",
    rating: "",
    interestPaymentFrequency:"",
    price: "",
    maturityDate: "",
  });

  const [updateBondDetails, setUpdateBondDetails] = useState({
    couponRate: "",
    price: "",
  });

  const [selectedBondId, setSelectedBondId] = useState("");
  const [activeSection, setActiveSection] = useState(""); // Track the active section
  const navigate = useNavigate();
  const token = localStorage.getItem("adminToken");

  useEffect(() => {
    if (!token) {
      navigate("/bond-admin-login");
    } else {
      fetchBonds();
      fetchUserInvestments();
    }
  }, [token]);

  const fetchBonds = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:3001/api/bonds", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBonds(response.data);
    } catch (err) {
      console.error("Error fetching bonds:", err.message);
      setError("Failed to fetch bonds.");
    } finally {
      setLoading(false);
    }
  };

  const fetchUserInvestments = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:3001/api/admin/investments",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUserInvestments(response.data);
    } catch (err) {
      console.error("Error fetching user investments:", err.message);
      setError("Failed to fetch user investments.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddBond = async (e) => {
    e.preventDefault();
    const { name, type, couponRate, rating, price, maturityDate } = bondDetails;
  
    // Validate all fields are filled
    if (!name || !type || !couponRate || !rating || !price || !maturityDate) {
      alert("Please fill all fields before submitting.");
      return;
    }
  
   
    const currentDate = new Date();
    const minMaturityDate = new Date();
    minMaturityDate.setFullYear(currentDate.getFullYear() + 1);
  
    if (new Date(maturityDate) <= minMaturityDate) {
      alert("The maturity date must be more than one year from today.");
      return;
    }
  
    try {
      await axios.post("http://localhost:3001/api/bonds", bondDetails, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Bond added successfully!");
      fetchBonds();
      setBondDetails({
        name: "",
        type: "",
        couponRate: "",
        rating: "",
        interestPaymentFrequency: "",
        price: "",
        maturityDate: "",
      });
    } catch (err) {
      console.error("Error adding bond:", err.message);
      alert("Failed to add bond.");
    }
  };
  

  const handleUpdateBond = async (e) => {
    e.preventDefault();

    if (!selectedBondId) {
      alert("Please select a bond to update.");
      return;
    }

    const { couponRate, price } = updateBondDetails;
    if (!couponRate || !price) {
      alert("Please fill all fields for updating.");
      return;
    }

    try {
      await axios.put(
        `http://localhost:3001/api/bonds/${selectedBondId}`,
        updateBondDetails,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Bond updated successfully!");
      fetchBonds();
      setUpdateBondDetails({ couponRate: "", price: "" });
      setSelectedBondId("");
    } catch (err) {
      console.error("Error updating bond:", err.message);
      alert("Failed to update bond.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/bond-admin-login");
  };

  const toggleSection = (section) => {
    setActiveSection((prev) => (prev === section ? "" : section));
  };

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      {loading && <div className="loader">Loading...</div>}
      {error && <div className="error">{error}</div>}

      <div className="dashboard-options">
        <button
          onClick={() => toggleSection("addBond")}
          className="dashboard-btn"
        >
          Add New Bond
        </button>
        <button
          onClick={() => toggleSection("updateBond")}
          className="dashboard-btn"
        >
          Update Bond
        </button>
        <button
          onClick={() => toggleSection("userInvestments")}
          className="dashboard-btn"
        >
          View All User Investments
        </button>
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>

      {/* Add Bond Form */}
      {activeSection === "addBond" && (
        <div id="add-bond-form">
          <h2>Add New Bond</h2>
          <form onSubmit={handleAddBond}>
            <input
              type="text"
              placeholder="Bond Name"
              value={bondDetails.name}
              onChange={(e) =>
                setBondDetails({ ...bondDetails, name: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Bond Type"
              value={bondDetails.type}
              onChange={(e) =>
                setBondDetails({ ...bondDetails, type: e.target.value })
              }
            />
            <input
              type="number"
              placeholder="Coupon Rate"
              value={bondDetails.couponRate}
              onChange={(e) =>
                setBondDetails({ ...bondDetails, couponRate: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Rating"
              value={bondDetails.rating}
              onChange={(e) =>
                setBondDetails({ ...bondDetails, rating: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="interestPaymentFrequency"
              value={bondDetails.interestPaymentFrequency}
              onChange={(e) =>
                setBondDetails({ ...bondDetails, interestPaymentFrequency: e.target.value })
              }
            />
            <input
              type="number"
              placeholder="Price"
              value={bondDetails.price}
              onChange={(e) =>
                setBondDetails({ ...bondDetails, price: e.target.value })
              }
            />
            <input
              type="date"
              placeholder="Maturity Date"
              value={bondDetails.maturityDate}
              onChange={(e) =>
                setBondDetails({
                  ...bondDetails,
                  maturityDate: e.target.value,
                })
              }
            />
            <button type="submit">Add Bond</button>
          </form>
        </div>
      )}

      {/* Update Bond Form */}
      {activeSection === "updateBond" && (
        <div id="update-bond-form">
          <h2>Update Bond</h2>
          <select
            onChange={(e) => setSelectedBondId(e.target.value)}
            value={selectedBondId}
          >
            <option value="">Select a bond</option>
            {bonds.map((bond) => (
              <option key={bond.id} value={bond.id}>
                {bond.name} - {bond.couponRate}% Coupon Rate
              </option>
            ))}
          </select>
          {selectedBondId && (
            <form onSubmit={handleUpdateBond}>
              <input
                type="number"
                placeholder="New Coupon Rate"
                value={updateBondDetails.couponRate}
                onChange={(e) =>
                  setUpdateBondDetails({
                    ...updateBondDetails,
                    couponRate: e.target.value,
                  })
                }
              />
              <input
                type="number"
                placeholder="New Price"
                value={updateBondDetails.price}
                onChange={(e) =>
                  setUpdateBondDetails({
                    ...updateBondDetails,
                    price: e.target.value,
                  })
                }
              />
              <button type="submit">Update Bond</button>
            </form>
          )}
        </div>
      )}

      {/* User Investments */}
      {activeSection === "userInvestments" && (
        <div id="user-investments">
          <h2>All User Investments</h2>
          {userInvestments.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>User Name</th>
                  <th>Bond Name</th>
                  <th>Amount</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {userInvestments.map((user) =>
                  user.investments.map((investment, idx) => (
                    <tr key={`${user.userId}-${idx}`}>
                      <td>{user.userName}</td>
                      <td>{investment.bondName}</td>
                      <td>{investment.totalInvestment}</td>
                      <td>
                        {new Date(investment.purchaseDate).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          ) : (
            <p>No investments found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
