const yahooFinance = require("yahoo-finance2").default;
const sharedState = require("./sharedState");
const IndianStock = require("./models/IndianStock");
const USStock = require("./models/USStock");

let mail = sharedState.mail;

// Utility function to calculate priorities and assign IDs
const calculatePriorities = (stocks) => {
    return stocks
        .sort((a, b) => b.currentvalue - a.currentvalue)
        .map((stock, index) => ({ ...stock, priority: index + 1, id: index + 1 }));
};

// Function to fetch live price of a stock using Yahoo Finance
const fetchLivePrice = async (symbol) => {
    try {
        const quote = await yahooFinance.quote(symbol);
        if (quote && quote.regularMarketPrice) {
            return parseFloat(quote.regularMarketPrice.toFixed(2));
        } else {
            console.error(`No data found for symbol: ${symbol}`);
            return null;
        }
    } catch (error) {
        console.error(`Error fetching live price for ${symbol}:`, error.message);
        return null;
    }
};

// Set email in session
const setEmailInSession = (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ message: "Email is required" });
    }
    mail = email;
    sharedState.mail = email;
    console.log("Session email set to:", mail);
    res.status(200).json({ message: "Email received successfully" });
};

// Get Indian stocks
const getIndianStocks = async (req, res) => {
    try {
        if (!mail) {
            return res.status(400).json({ message: "Email is required" });
        }
        const user = await IndianStock.findOne({ email: mail });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user.stocks);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error");
    }
};

// Get US stocks
const getUSStocks = async (req, res) => {
    try {
        if (!mail) {
            return res.status(400).json({ message: "Email is required" });
        }
        const user = await USStock.findOne({ email: mail });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user.stocks);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error");
    }
};

const addIndianStock = async (req, res) => {
    try {
        if (!mail) {
            return res.status(400).json({ message: "Email is required" });
        }

        const newStock = req.body;
        const livePrice = await fetchLivePrice(newStock.symbol);

        if (livePrice) {
            newStock.liveprice = livePrice;
            newStock.currentvalue = livePrice * newStock.units;
            newStock.change = ((livePrice - newStock.avgbuyprice) / newStock.avgbuyprice) * 100;
        }

        let user = await IndianStock.findOne({ email: mail });
        
        // Create the user if not found
        if (!user) {
            user = new IndianStock({ email: mail, stocks: [] });
        }

        // Check if the stock already exists
        const existingStockIndex = user.stocks.findIndex(stock => stock.symbol === newStock.symbol);
        if (existingStockIndex !== -1) {
            // Update the existing stock
            const existingStock = user.stocks[existingStockIndex];
            existingStock.units += newStock.units;
            existingStock.avgbuyprice = 
                ((existingStock.avgbuyprice * existingStock.units) + (newStock.avgbuyprice * newStock.units)) /
                (existingStock.units + newStock.units);
            existingStock.liveprice = newStock.liveprice;
            existingStock.currentvalue = existingStock.liveprice * existingStock.units;
            existingStock.change = ((existingStock.liveprice - existingStock.avgbuyprice) / existingStock.avgbuyprice) * 100;

            user.stocks[existingStockIndex] = existingStock;
        } else {
            // Add as a new stock
            user.stocks.push(newStock);
        }

        // Recalculate priorities and assign new IDs to all stocks
        user.stocks = calculatePriorities(user.stocks);

        // Save the updated or new user document
        await user.save();

        res.status(201).json(user);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error");
    }
};


const addUSStock = async (req, res) => {
    try {
        if (!mail) {
            return res.status(400).json({ message: "Email is required" });
        }

        const newStock = req.body;
        const livePrice = await fetchLivePrice(newStock.symbol);

        if (livePrice) {
            newStock.liveprice = livePrice;
            newStock.currentvalue = livePrice * newStock.units;
            newStock.change = ((livePrice - newStock.avgbuyprice) / newStock.avgbuyprice) * 100;
        }

        let user = await USStock.findOne({ email: mail });
        
        // Create the user if not found
        if (!user) {
            user = new USStock({ email: mail, stocks: [] });
        }

        // Check if the stock already exists
        const existingStockIndex = user.stocks.findIndex(stock => stock.symbol === newStock.symbol);
        if (existingStockIndex !== -1) {
            // Update the existing stock
            const existingStock = user.stocks[existingStockIndex];
            existingStock.units += newStock.units;
            existingStock.avgbuyprice = 
                ((existingStock.avgbuyprice * existingStock.units) + (newStock.avgbuyprice * newStock.units)) /
                (existingStock.units + newStock.units);
            existingStock.liveprice = newStock.liveprice;
            existingStock.currentvalue = existingStock.liveprice * existingStock.units;
            existingStock.change = ((existingStock.liveprice - existingStock.avgbuyprice) / existingStock.avgbuyprice) * 100;

            user.stocks[existingStockIndex] = existingStock;
        } else {
            // Add as a new stock
            user.stocks.push(newStock);
        }

        // Recalculate priorities and assign new IDs to all stocks
        user.stocks = calculatePriorities(user.stocks);

        // Save the updated or new user document
        await user.save();

        res.status(201).json(user);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error");
    }
};



const modifyIndianStock = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedData = req.body;

        if (!mail) {
            return res.status(400).json({ message: "Email is required" });
        }

        const user = await IndianStock.findOne({ email: mail });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const stockIndex = user.stocks.findIndex(stock => stock.id === parseInt(id));
        if (stockIndex === -1) {
            return res.status(404).json({ message: "Stock not found" });
        }

        const stock = user.stocks[stockIndex];

        // Ensure `symbol` remains unchanged if not provided in the update
        const updatedStock = {
            ...stock,
            ...updatedData,
            symbol: stock.symbol, // Retain the existing symbol
        };

        // Attempt to fetch the latest live price
        const livePrice = await fetchLivePrice(updatedStock.symbol);

        // If live price fetch fails, retain the existing live price
        updatedStock.liveprice = livePrice ?? stock.liveprice;

        // Recalculate `currentvalue` and `change` using the updated or existing live price
        updatedStock.currentvalue = parseFloat((updatedStock.liveprice * updatedStock.units).toFixed(2));
        updatedStock.change = parseFloat(
            (((updatedStock.liveprice - updatedStock.avgbuyprice) / updatedStock.avgbuyprice) * 100).toFixed(2)
        );

        // Replace the old stock with the updated one
        user.stocks[stockIndex] = updatedStock;

        // Recalculate priorities and reassign IDs
        user.stocks = calculatePriorities(user.stocks);

        // Save the updated user document
        await user.save();

        res.status(200).json({ message: "Stock updated successfully", updatedStock });
    } catch (error) {
        console.error("Error in modifyIndianStock:", error.message);
        res.status(500).send("Server Error");
    }
};


const modifyUSStock = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedData = req.body;

        if (!mail) {
            return res.status(400).json({ message: "Email is required" });
        }

        const user = await USStock.findOne({ email: mail });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const stockIndex = user.stocks.findIndex(stock => stock.id === parseInt(id));
        if (stockIndex === -1) {
            return res.status(404).json({ message: "Stock not found" });
        }

        const stock = user.stocks[stockIndex];

        // Ensure `symbol` remains unchanged if not provided in the update
        const updatedStock = {
            ...stock,
            ...updatedData,
            symbol: stock.symbol, // Retain the existing symbol
        };

        // Attempt to fetch the latest live price
        const livePrice = await fetchLivePrice(updatedStock.symbol);

        // If live price fetch fails, retain the existing live price
        updatedStock.liveprice = livePrice ?? stock.liveprice;

        // Recalculate `currentvalue` and `change` using the updated or existing live price
        updatedStock.currentvalue = parseFloat((updatedStock.liveprice * updatedStock.units).toFixed(2));
        updatedStock.change = parseFloat(
            (((updatedStock.liveprice - updatedStock.avgbuyprice) / updatedStock.avgbuyprice) * 100).toFixed(2)
        );

        // Replace the old stock with the updated one
        user.stocks[stockIndex] = updatedStock;

        // Recalculate priorities and reassign IDs
        user.stocks = calculatePriorities(user.stocks);

        // Save the updated user document
        await user.save();

        res.status(200).json({ message: "Stock updated successfully", updatedStock });
    } catch (error) {
        console.error("Error in modifyUSStock:", error.message);
        res.status(500).send("Server Error");
    }
};

// Delete Indian stock
const deleteIndianStock = async (req, res) => {
  try {
      const { id } = req.params;

      if (!mail) {
          return res.status(400).json({ message: "Email is required" });
      }

      // Find the user
      const user = await IndianStock.findOne({ email: mail });
      if (!user) {
          return res.status(404).json({ message: "User not found" });
      }

      // Filter out the stock to delete
      user.stocks = user.stocks.filter(stock => stock.id !== parseInt(id));

      // Recalculate priorities and reassign IDs
      user.stocks = calculatePriorities(user.stocks);

      // Save the updated user document
      await user.save();

      res.status(200).json({ message: "Stock deleted successfully", stocks: user.stocks });
  } catch (error) {
      console.error(error.message);
      res.status(500).send("Server Error");
  }
};

const deleteUSStock = async (req, res) => {
  try {
      const { id } = req.params;

      if (!mail) {
          return res.status(400).json({ message: "Email is required" });
      }

      // Find the user
      const user = await USStock.findOne({ email: mail });
      if (!user) {
          return res.status(404).json({ message: "User not found" });
      }

      // Filter out the stock to delete
      user.stocks = user.stocks.filter(stock => stock.id !== parseInt(id));

      // Recalculate priorities and reassign IDs
      user.stocks = calculatePriorities(user.stocks);

      // Save the updated user document
      await user.save();

      res.status(200).json({ message: "Stock deleted successfully", stocks: user.stocks });
  } catch (error) {
      console.error(error.message);
      res.status(500).send("Server Error");
  }
};

// Update live prices for all stocks
const updateLivePrices = async () => {
    try {
        const updateCollection = async (Model) => {
            const users = await Model.find();
            for (const user of users) {
                const updatedStocks = await Promise.all(
                    user.stocks.map(async (stock) => {
                        const livePrice = await fetchLivePrice(stock.symbol);
                        if (livePrice) {
                            stock.liveprice = livePrice;
                            stock.currentvalue = livePrice * stock.units;
                            stock.change = ((livePrice - stock.avgbuyprice) / stock.avgbuyprice) * 100;
                        }
                        return stock;
                    })
                );

                const prioritizedStocks = calculatePriorities(updatedStocks);
                await Model.findByIdAndUpdate(user._id, { stocks: prioritizedStocks });
            }
        };

        await updateCollection(IndianStock);
        await updateCollection(USStock);

        console.log("Live prices updated for all users.");
    } catch (error) {
        console.error("Error updating live prices:", error.message);
    }
};

// Schedule periodic live price updates
const scheduleLivePriceUpdates = () => {
    updateLivePrices();
    setInterval(updateLivePrices, 5 * 60 * 1000);
};

// Export functions
module.exports = {
    setEmailInSession,
    getIndianStocks,
    getUSStocks,
    addIndianStock,
    addUSStock,
    modifyIndianStock,
    modifyUSStock,
    deleteIndianStock,
    deleteUSStock,
    updateLivePrices,
    scheduleLivePriceUpdates,
};
