const { readFile, saveFile, getBonds } = require("../models/bondModel");


// Admin - Get all user investments
const getAllUserInvestments = async (req, res) => {
    try {
        // Check if the user is an admin
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Only admin can view all user investments." });
        }

        // Fetch all users
        const users = await readFile("./data/users.json");
        const bonds = await getBonds(); // Get all bonds to map with purchases

        // Collect all users' investments (purchases)
        const userInvestments = users.map(user => {
            const investments = (user.purchases || []).map(purchase => {
                const bond = bonds.find(b => b.name === purchase.bondName || b.type === purchase.bondName);
                return {
                    ...purchase,
                    bondDetails: bond || {}, // Include bond details in the response
                };
            });

            return {
                userId: user.id,
                userName: user.name,
                investments,
            };
        });

        res.status(200).json(userInvestments);
    } catch (error) {
        console.error("Error fetching user investments:", error);
        res.status(500).json({ message: "Error fetching user investments.", error: error.message });
    }
};



// Purchase a bond
const purchaseBond = async (req, res) => {
    try {
        const { bondName, quantity } = req.body;
        if (!bondName || !quantity || quantity <= 0) {
            return res.status(400).json({ message: "Invalid bond name or quantity." });
        }

        // Get bond details
        const bonds = await getBonds(); // Ensure this is an async function if it's reading from a file or DB
        const bond = bonds.find((b) => b.name === bondName || b.type === bondName); // Match by name or type

        if (!bond) {
            return res.status(404).json({ message: "Bond not found." });
        }

        // Fetch user data
        const users = await readFile("./data/users.json"); // Awaiting asynchronous readFile
        const userIndex = users.findIndex((u) => u.id === req.user.id);

        if (userIndex === -1) {
            return res.status(404).json({ message: "User not found." });
        }

        // Create purchase record
        const purchasedBond = {
            bondName,
            quantity,
            totalInvestment: bond.price * quantity || 0, // Use bond price, default to 0 if missing
            purchaseDate: new Date().toISOString(),
        };

        // Update user's purchases
        if (!users[userIndex].purchases) {
            users[userIndex].purchases = [];
        }
        users[userIndex].purchases.push(purchasedBond);

        // Save updated user data
        await saveFile("./data/users.json", users); // Awaiting asynchronous saveFile

        res.status(201).json({ message: "Bond purchased successfully.", purchasedBond });
    } catch (error) {
        console.error("Error purchasing bond:", error);
        res.status(500).json({ message: "Error purchasing bond.", error: error.message });
    }
};

// Get all purchases for a user
const getUserPurchases = async (req, res) => {
    try {
        // Fetch user and bond data
        const users = await readFile("./data/users.json"); // Awaiting asynchronous readFile
        const bonds = await getBonds(); // Ensure this is async if necessary

        // Find user by ID
        const user = users.find((u) => u.id === req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        // Map user's purchases with bond details
        const userBonds = (user.purchases || []).map((purchase) => {
            const bond = bonds.find((b) => b.name === purchase.bondName || b.type === purchase.bondName);
            return {
                ...purchase,
                bondDetails: bond || {}, // Default to empty object if bond is not found
            };
        });

        res.status(200).json(userBonds);
    } catch (error) {
        console.error("Error fetching purchases:", error);
        res.status(500).json({ message: "Error fetching purchased bonds.", error: error.message });
    }
};

module.exports = { purchaseBond, getUserPurchases, getAllUserInvestments };
