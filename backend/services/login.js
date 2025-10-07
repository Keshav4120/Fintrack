// login.js
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const { readFile } = require("../utils/file");
const { secretKey } = require("../configuration/jwtConfig");

// Services: Login Logic
async function loginService(email, password) {
    try {
        const users = readFile("./data/users.json");
        const existingUser = users.find(user => user.email === email);
        if (!existingUser) {
            throw new Error("User not found");
        }
        const isPasswordValid = password === existingUser.password;
        console.log(password)
        if (!isPasswordValid) {
            throw new Error("Incorrect password");
        }
        const token = jwt.sign(
            { id: existingUser.id, email: existingUser.email, role: existingUser.role },
            secretKey,
            { expiresIn: "1h" }
        );
        return token;
    } catch (error) {
        console.log("Login error: ", error.message);
        throw new Error("Invalid credentials");
    }
}

// Controller: Login
async function loginController(req, res) {
    try {
        const { email, password } = req.body;
        const token = await loginService(email, password);
        res.json({ token });
    } catch (error) {
        res.status(401).json({ message: "Invalid credentials" });
    }
}

// Routes: Login
const router = express.Router();
router.use(cors());
router.post("/login", loginController);

module.exports = router;
