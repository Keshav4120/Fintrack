const mongoose = require("mongoose");
const stockController = require("./stocks/stockController");

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb+srv://aadarsh:kjDH7kOoOz5gtfu9@financeapp.khxs0.mongodb.net/stocks?retryWrites=true&w=majority&appName=financeapp', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("MongoDB Connected");
        stockController.scheduleLivePriceUpdates();
    } catch (error) {
        console.error("MongoDB connection error:", error);
        process.exit(1);
    }
};

module.exports = connectDB;

