const mongoose = require('mongoose');

const loanSchema = new mongoose.Schema({
    loanType: { type: String, required: false },
    portfolioSizeOrIncome: { type: Number, required: false  },
    loanAmount: { type: Number, required: false },
    tenure: { type: Number, required: true },
    approvalDate: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Loan', loanSchema,"loans");
