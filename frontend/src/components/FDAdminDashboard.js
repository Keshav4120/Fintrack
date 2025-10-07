import React, { useState, useEffect } from 'react';
import "../styles/FDAdminLogin.css";

function FDAdminDashboard() {
  const [fdData, setFdData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newFd, setNewFd] = useState({ name: '', interest: '', tenure: '' });
  const [editFd, setEditFd] = useState(null);
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  useEffect(() => {
    const fetchFDData = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/fds');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        setFdData(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFDData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewFd((prevFd) => ({
      ...prevFd,
      [name]: value,
    }));

    if (editFd) {
      setEditFd((prevEditFd) => ({
        ...prevEditFd,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newFd.name || !newFd.interest || !newFd.tenure) {
      setMessage('Please fill all the fields.');
      return;
    }

    try {
      if (editFd) {
        const response = await fetch(`http://localhost:3001/api/fds/${editFd.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editFd),
        });

        if (!response.ok) {
          throw new Error('Failed to update FD');
        }

        const updatedFd = await response.json();
        setFdData((prevFdData) =>
          prevFdData.map((fd) => (fd.id === updatedFd.id ? updatedFd : fd))
        );
        setMessage('Fixed Deposit updated successfully!');
        setEditFd(null);
      } else {
        const response = await fetch('http://localhost:3001/api/fds', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newFd),
        });

        if (!response.ok) {
          throw new Error('Failed to add FD');
        }

        const addedFd = await response.json();
        setFdData((prevFdData) => [...prevFdData, addedFd]);
        setMessage('Fixed Deposit added successfully!');
        setNewFd({ name: '', interest: '', tenure: '' });
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:3001/api/fds/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete FD');
      }

      setFdData((prevFdData) => prevFdData.filter((fd) => fd.id !== id));
      setMessage('Fixed Deposit deleted successfully!');
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const renderTableData = () => {
    const filteredData = fdData.filter((fd) =>
      fd.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentPageData = filteredData.slice(startIndex, startIndex + itemsPerPage);

    return currentPageData.map((fd) => (
      <tr key={fd.id}>
        <td>{fd.id}</td>
        <td>{fd.name}</td>
        <td>{fd.interest}</td>
        <td>{fd.tenure}</td>
        <td>
          <button className="edit-button" onClick={() => setEditFd(fd)}>
            Edit
          </button>
          <button className="delete-button" onClick={() => handleDelete(fd.id)}>
            Delete
          </button>
        </td>
      </tr>
    ));
  };

  const renderPagination = () => {
    const filteredData = fdData.filter((fd) =>
      fd.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    return (
      <div className="pagination">
        <button
          onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
          disabled={currentPage === 1}
          className="pagination-button"
        >
          Previous
        </button>
        <span className="page-number">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="pagination-button"
        >
          Next
        </button>
      </div>
    );
  };

  const renderForm = () => {
    return (
      <form onSubmit={handleSubmit} className="fd-form">
        <label className="fd-form-label">
          FD Name:
          <input
            type="text"
            name="name"
            value={editFd ? editFd.name : newFd.name}
            onChange={handleChange}
            className="fd-form-input"
            placeholder="Enter FD Name"
            required
          />
        </label>
        <label className="fd-form-label">
          Interest Rate:
          <input
            type="number"
            step="0.1"
            name="interest"
            value={editFd ? editFd.interest : newFd.interest}
            onChange={handleChange}
            className="fd-form-input"
            placeholder="Enter Interest Rate"
            required
          />
        </label>
        <label className="fd-form-label">
          Tenure:
          <input
            type="text"
            name="tenure"
            value={editFd ? editFd.tenure : newFd.tenure}
            onChange={handleChange}
            className="fd-form-input"
            placeholder="Enter Tenure"
            required
          />
        </label>
        <div className="form-actions">
          <button type="submit" className="submit-button">
            {editFd ? 'Update FD' : 'Add FD'}
          </button>
          {editFd && (
            <button type="button" className="cancel-button" onClick={() => setEditFd(null)}>
              Cancel
            </button>
          )}
        </div>
      </form>
    );
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="fd-admin-dashboard">
      <h1 className="dashboard-title">Fixed Deposit Admin Dashboard</h1>

      {message && <div className="feedback-message">{message}</div>}

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by FD Name"
          value={searchQuery}
          onChange={handleSearchChange}
          className="search-input"
        />
      </div>

      <div className="fd-list">
        <h2>Active Fixed Deposits</h2>
        <table className="fd-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Interest Rate</th>
              <th>Tenure</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>{renderTableData()}</tbody>
        </table>
      </div>

      {renderPagination()}

      <div className="fd-form-container">
        <h2>{editFd ? 'Update Fixed Deposit' : 'Add New Fixed Deposit'}</h2>
        {renderForm()}
      </div>
    </div>
  );
}

export default FDAdminDashboard;
