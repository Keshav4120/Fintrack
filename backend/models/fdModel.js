const mongoose = require('mongoose');

const fdSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    tenure: {
        type: Number,
        required: true,
    },
    interest: {
        type: Number,
        required: true,
    },
    minInvestment: {
        type: Number,
        required: false,
    },
    balance: {
        type: Number,
        default: 0, // Default balance is 0
    },
}, { timestamps: true });

const FD = mongoose.model('FD', fdSchema, "fd");
module.exports = FD;
