const express = require("express");
const bcrypt = require("bcrypt");
const cors = require("cors");
const { promises: fs } = require("fs");

// Helper: Validation Functions
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidName(name) {
    const nameRegex = /^[a-zA-Z\s]+$/; // Ensures only alphabets and spaces
    return nameRegex.test(name);
}

function isValidPassword(password) {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d{2,})(?=.*[@])[A-Za-z\d@]{8,15}$/;
    return passwordRegex.test(password);
}

// Helper: File Read and Write
async function readFile(filePath) {
    try {
        const data = await fs.readFile(filePath, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        throw new Error("Error reading user data");
    }
}

async function writeFile(filePath, data) {
    try {
        await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
    } catch (err) {
        throw new Error("Error writing user data");
    }
}

// Services: Signup Logic
async function createUserService(userData) {
    const { name, email, password } = userData;

    // Validate email format
    if (!isValidEmail(email)) {
        throw new Error("Invalid email format");
    }

    // Validate name (only alphabets allowed)
    if (!isValidName(name)) {
        throw new Error("Name should only contain alphabets and spaces");
    }

    // Validate password (8-15 chars, 2+ numbers, @, and letters)
    if (!isValidPassword(password)) {
        throw new Error("Password must be 8-15 characters, include 2+ numbers, '@', and letters");
    }

    // Hash password and save user
    const hashedPassword = await bcrypt.hash(password, 10);
    const users = await readFile("./data/users.json");
    const newUser = {
        id: users.length + 1,
        name,
        email,
        password: password,
        role: "customer"
    };
    users.push(newUser);
    await writeFile("./data/users.json", users);
    return newUser;
}

// Controller: Signup
async function signupController(req, res) {
    try {
        const userData = req.body;
        const user = await createUserService(userData);
        res.status(201).json({ user, message: "User created successfully" });
    } catch (error) {
        console.error("Signup Error:", error.message); // Log error for debugging
        res.status(400).json({ message: error.message });
    }
}

// Routes: Signup
const router = express.Router();

router.use(cors());
router.post("/register", signupController);

module.exports = router;
