import React from 'react';
import { Link } from 'react-router-dom';
import './Loan.css';

function Loan() {
  return (
    <div className="loan-grid">
      <h2 className="loan-title">Loan</h2>
      <Link to="/apply-loan" className="loan-card-link">
        <div className="loan-card">
          <i className="loan-icon fas fa-credit-card"></i>
          <h5>Apply for a Loan</h5>
        </div>
      </Link>
      <Link to="/existing-loan" className="loan-card-link">
        <div className="loan-card">
          <i className="loan-icon fas fa-list-alt"></i>
          <h5>Existing Loan</h5>
        </div>
      </Link>
    </div>
  );
}

export default Loan;
