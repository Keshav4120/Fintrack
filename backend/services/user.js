const express = require("express");
const cors = require("cors");
const { promises: fs } = require("fs");
const authMiddleware = require("../utils/authMiddleware");

// Helper: File Read
async function readFile(filePath) {
    try {
        const data = await fs.readFile(filePath, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        throw new Error("Error reading user data from file");
    }
}

// Services: User Logic
async function getUserService() {
    try {
        const users = await readFile("./data/users.json");
        return users;
    } catch (error) {
        throw new Error("Error retrieving user data");
    }
}

// Controller: Get Users
async function getUsersController(req, res) {
    try {
        const users = await getUserService();

        // Check if the user is an admin
        if (req.user.role === "admin") {
            res.json(users);
        } else {
            const user = users.find(u => u.id === req.user.id);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            res.json(user);
        }
    } catch (error) {
        console.error("Error fetching users:", error.message);
        res.status(500).json({ message: error.message || "Internal server error" });
    }
}

// Routes: Get Users
const router = express.Router();

// Enable CORS
const corsOptions = {
    origin: "http://localhost:3000",  // Adjust to match your frontend's origin
    methods: ["GET", "OPTIONS"],  // Only allow GET and OPTIONS methods
    allowedHeaders: ["Content-Type"]
};

router.use(cors(corsOptions));

// Get users route with authentication middleware
router.get("/users", authMiddleware.authenticateToken, getUsersController);

module.exports = router;
