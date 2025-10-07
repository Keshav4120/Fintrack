const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sharedState = require('../sharedState');

// MongoDB Model
const IndianStock = require('../models/IndianStock');

const router = express.Router();
router.use(bodyParser.json());
router.use(cors());

// Helper function to load portfolio data for a specific email
const loadPortfolioByEmail = async (email) => {
    if (!email) {
        console.error("No email found in session.");
        return [];
    }
    try {
        // Find the user's portfolio in MongoDB
        const user = await IndianStock.findOne({ email });
        if (user) {
            return user.stocks; // "stocks" holds the user's stock data
        } else {
            console.error(`Portfolio for email ${email} not found.`);
            return [];
        }
    } catch (err) {
        console.error("Error loading portfolio data:", err.message);
        return [];
    }
};

// Utility functions
const calculateTotalValue = (portfolio) =>
    portfolio.reduce((sum, stock) => sum + parseFloat(stock.currentvalue || 0), 0).toFixed(2);

const getStockSummary = (symbol, portfolio) => {
    const stock = portfolio.find((s) => s.symbol.toUpperCase() === symbol.toUpperCase());
    if (!stock) return `I couldn't find any stock with the symbol "${symbol}" in your portfolio.`;

    return `Here is the summary for ${stock.name} (${stock.symbol}): 
- Units: ${stock.units}
- Avg Buy Price: ₹${stock.avgbuyprice}
- Current Price: ₹${stock.liveprice || 'N/A'}
- Current Value: ₹${stock.currentvalue || 'N/A'}
- Change: ${stock.change || 'N/A'}%`;
};

const getTopPerformers = (portfolio) => {
    const sorted = [...portfolio].sort((a, b) => parseFloat(b.change || 0) - parseFloat(a.change || 0));
    return sorted.slice(0, 3).map(stock => `${stock.name} (${stock.symbol}): ${stock.change || 'N/A'}%`).join('\n');
};

// Chatbot endpoint
router.post('/chatboti', async (req, res) => {
    const email = sharedState.mail;
    const { message } = req.body;
    const lowerMessage = message.toLowerCase();

    // Load the portfolio for the specific user using email
    const portfolio = await loadPortfolioByEmail(email);

    if (!portfolio || portfolio.length === 0) {
        return res.json({ reply: "I couldn't find your portfolio data." });
    }

    // Respond to portfolio-related tracking questions
    if (lowerMessage.includes("portfolio value")) {
        const totalValue = calculateTotalValue(portfolio);
        return res.json({ reply: `The total value of your portfolio is ₹${totalValue}.` });
    }

    if (lowerMessage.includes("top performers")) {
        const topPerformers = getTopPerformers(portfolio);
        return res.json({ reply: `Here are your top-performing stocks:\n${topPerformers}` });
    }

    const stockMatch = portfolio.find((stock) => lowerMessage.includes(stock.symbol.toLowerCase()));
    if (stockMatch) {
        const stockSummary = getStockSummary(stockMatch.symbol, portfolio);
        return res.json({ reply: stockSummary });
    }

    return res.json({
        reply: "I can help you track your portfolio! Ask me about total portfolio value, stock performance, or setting alerts.",
    });
});

module.exports = router;
