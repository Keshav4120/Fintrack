const jwt = require("jsonwebtoken");
const { secretKey } = require("../configuration/jwtConfig");

/**
 * Generates a JWT token for a given user.
 * @param {Object} user - The user object containing id, email, and role.
 * @returns {string} - The generated JWT token.
 * @throws {Error} - Throws an error if the user object is invalid.
 */
function generateToken(user) {
    if (!user || !user.id || !user.email || !user.role) {
        throw new Error("Invalid user object. 'id', 'email', and 'role' are required.");
    }

    const payload = {
        id: user.id,
        email: user.email,
        role: user.role
    };

    try {
        const token = jwt.sign(payload, secretKey, { expiresIn: "1h" });
        return token;
    } catch (error) {
        console.error("Error generating JWT token:", error.message);
        throw new Error("Failed to generate JWT token");
    }
}

module.exports = {
    generateToken
};
