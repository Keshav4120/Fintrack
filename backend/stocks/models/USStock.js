const mongoose = require("mongoose");

const USStockSchema = new mongoose.Schema({
    email: { type: String, required: true }, // User's email
    stocks: [
        {
            name: { type: String, required: true }, // Stock name
            symbol: { type: String, required: true }, // Stock symbol
            sector: { type: String }, // Sector to which the stock belongs
            units: { type: Number, required: true }, // Number of units owned
            avgbuyprice: { type: Number, required: true }, // Average buy price
            liveprice: { type: Number }, // Current live price
            currentvalue: { type: Number }, // Current total value (liveprice * units)
            change: { type: Number }, // Percentage change in stock value
            priority: { type: Number }, // Priority based on current value
            id: { type: Number, required: true }, // Unique ID for the stock
        },
    ],
});

module.exports = mongoose.model("USStock", USStockSchema, "us_stocks");
