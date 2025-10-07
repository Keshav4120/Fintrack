const Loan = require('../models/Loan'); // Adjust the path as necessary

// Function to get all approved loans
const getApprovedLoans = async (req, res) => {
    try {
        const loans = await Loan.find();
        res.json(loans);
    } catch (err) {
        console.error("Error fetching loans: ", err.message);
        res.status(500).send('Server Error');
    }
};

// Function to get a specific loan by ID
const getLoanById = async (req, res) => {
    try {
        const { loanId } = req.params; // Extract loanId from URL parameters
        const loan = await Loan.findById(loanId);

        if (!loan) {
            return res.status(404).send('Loan not found');
        }

        res.json(loan);
    } catch (err) {
        console.error("Error fetching loan by ID: ", err.message);
        res.status(500).send('Server Error');
    }
};

// Function to approve a loan
const approveLoan = async (req, res) => {
    try {
        const { loanType, portfolioSizeOrIncome, loanAmount, tenure } = req.body;

        const newLoan = new Loan({
            loanType,
            portfolioSizeOrIncome,
            loanAmount,
            tenure,
        });

        const savedLoan = await newLoan.save();
        res.status(201).json(savedLoan);
    } catch (err) {
        console.error("Error approving loan: ", err.message);
        res.status(500).send('Server Error');
    }
};

// Function to estimate the loan based on portfolio size or bank statement
const estimateLoan = (req, res) => {
    try {
        const { portfolioSizeOrIncome, bankStatementLoan } = req.body;

        let estimatedLoan = portfolioSizeOrIncome * 10;

        if (bankStatementLoan && bankStatementLoan > 0) {
            estimatedLoan = bankStatementLoan;
        }

        res.status(200).json({ estimatedLoan });
    } catch (err) {
        console.error("Error estimating loan: ", err.message);
        res.status(500).send('Server Error');
    }
};

// Function to update an existing loan
const updateLoan = async (req, res) => {
    try {
        const { loanId } = req.params; // Extract loanId from URL parameters
        const { loanType, portfolioSizeOrIncome, loanAmount, tenure } = req.body;

        const updatedLoan = await Loan.findByIdAndUpdate(
            loanId,
            { loanType, portfolioSizeOrIncome, loanAmount, tenure, approvalDate: new Date() },
            { new: true }
        );

        if (!updatedLoan) {
            return res.status(404).send('Loan not found');
        }

        res.json(updatedLoan);
    } catch (err) {
        console.error("Error updating loan: ", err.message);
        res.status(500).send('Server Error');
    }
};

// Function to delete a loan
const deleteLoan = async (req, res) => {
    try {
        const { loanId } = req.params; // Extract loanId from URL parameters
        const deletedLoan = await Loan.findByIdAndDelete(loanId);

        if (!deletedLoan) {
            return res.status(404).send('Loan not found');
        }

        res.status(204).send('Loan deleted successfully');
    } catch (err) {
        console.error("Error deleting loan: ", err.message);
        res.status(500).send('Server Error');
    }
};

module.exports = {
    getApprovedLoans,
    getLoanById,
    approveLoan,
    estimateLoan,
    updateLoan,
    deleteLoan,
};
