const mongoose = require("mongoose");

const bondSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    type: { type: String, required: true },
    price: { type: Number, required: true },
    rating: String,
    couponRate: Number,
    maturityDate: Date,
    interestPaymentFrequency: String,
    yieldToMaturity: Number,
    securityClass: String,
    allotmentDate: Date,
});

const Bond = mongoose.model("Bond", bondSchema,"bonds");

module.exports = Bond;