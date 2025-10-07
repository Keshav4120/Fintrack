import React, { useState, useEffect } from 'react';
import './LoanAdminDashboard.css';

function LoanAdminDashboard() {
  const [loanData, setLoanData] = useState([]);
  const [approvedLoans, setApprovedLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loanName, setLoanName] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [loanTenure, setLoanTenure] = useState('');

  // Fetch loan data from backend
  useEffect(() => {
    const fetchLoanData = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/loans/approve');
        if (!response.ok) {
          throw new Error('Failed to fetch loan data');
        }
        const data = await response.json();
        setLoanData(data);
      } catch (error) {
        setError(error.message);
      }
      setLoading(false);
    };

    const fetchApprovedLoans = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/loans/approve');
        if (!response.ok) {
          throw new Error('Failed to fetch approved loans');
        }
        const data = await response.json();
        setApprovedLoans(data);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchLoanData();
    fetchApprovedLoans();
  }, []);

  // Handle the form submission to add a new loan
  const handleAddLoan = async (event) => {
    event.preventDefault();

    const newLoan = {
      name: loanName,
      interestRate: interestRate,
      tenure: loanTenure,
    };

    try {
      const response = await fetch('http://localhost:3001/api/loans/approve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newLoan),
      });

      if (!response.ok) {
        throw new Error('Failed to add new loan');
      }

      const data = await response.json();
      setLoanData([...loanData, data]);
      setLoanName('');
      setInterestRate('');
      setLoanTenure('');
    } catch (error) {
      setError(error.message);
    }
  };

  // Handle loan approval
  const handleApproveLoan = async (loanId) => {
    try {
      const response = await fetch(`http://localhost:3001/api/loans/approve/${loanId}`, {
        method: 'PATCH',
      });

      if (response.ok) {
        throw new Error(' loan is approved ');
      }

      // Move the approved loan to the Approved Loans section
      const approvedLoan = loanData.find((loan) => loan.id === loanId);
      setApprovedLoans([...approvedLoans, approvedLoan]);
      setLoanData(loanData.filter((loan) => loan.id !== loanId));
    } catch (error) {
      setError(error.message);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="loan-admin-dashboard">
      <h1 className="header">Loan Admin Dashboard</h1>

      <div className="loan-section">
        <h2>Active Loans</h2>
        <table className="loan-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Interest Rate (%)</th>
              <th>Tenure (Months)</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {loanData.map((loan) => (
              <tr key={loan.id}>
                <td>{loan.id}</td>
                <td>{loan.name}</td>
                <td>{loan.interestRate}</td>
                <td>{loan.tenure}</td>
                <td>
                  <button
                    className="btn-approve"
                    onClick={() => handleApproveLoan(loan.id)}
                  >
                    Approve
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="loan-section">
        <h2>Approved Loans</h2>
        <table className="loan-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Interest Rate (%)</th>
              <th>Tenure (Months)</th>
            </tr>
          </thead>
          <tbody>
            {approvedLoans.map((loan) => (
              <tr key={loan.id}>
                <td>{loan.id}</td>
                <td>{loan.name}</td>
                <td>{loan.interestRate}</td>
                <td>{loan.tenure}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="loan-section add-loan-form">
        <h2>Add New Loan</h2>
        <form onSubmit={handleAddLoan}>
          <div className="form-group">
            <label>Loan Name:</label>
            <input
              type="text"
              value={loanName}
              onChange={(e) => setLoanName(e.target.value)}
              placeholder="Enter Loan Name"
              required
            />
          </div>
          <div className="form-group">
            <label>Interest Rate (%):</label>
            <input
              type="number"
              step="0.1"
              value={interestRate}
              onChange={(e) => setInterestRate(e.target.value)}
              placeholder="Enter Interest Rate"
              required
            />
          </div>
          <div className="form-group">
            <label>Tenure (Months):</label>
            <input
              type="number"
              value={loanTenure}
              onChange={(e) => setLoanTenure(e.target.value)}
              placeholder="Enter Loan Tenure"
              required
            />
          </div>
          <button type="submit" className="btn-submit">Add Loan</button>
        </form>
      </div>
    </div>
  );
}

export default LoanAdminDashboard;
