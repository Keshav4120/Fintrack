const jwt = require("jsonwebtoken");
const { secretKey } = require("../configuration/jwtConfig");

function authenticateToken(req, res, next) {
    // Check if the Authorization header exists
    const authHeader = req.header("Authorization");

    // If the Authorization header is missing, return an error
    if (!authHeader) {
        console.error("No authorization header provided");
        return res.status(401).json({ message: "Unauthorized: Missing token!" });
    }

    // Split the header to extract Bearer and token parts
    const [bearer, token] = authHeader.split(" ");

    // If the token format is incorrect, return an error
    if (bearer !== "Bearer" || !token) {
        console.error("Invalid token format");
        return res.status(401).json({ message: "Unauthorized: Invalid token format" });
    }

    // Verify the JWT token with the secret key
    jwt.verify(token, secretKey, (err, user) => {
        // If the token verification fails, return an error
        if (err) {
            console.error("Token verification failed:", err.message || err);
            return res.status(403).json({ message: "Forbidden: Invalid or expired token" });
        }

        // Attach the user data to the request object for access in subsequent middleware/routes
        req.user = user;

        // Log successful token authentication
        console.log(`Token authenticated successfully for user: ${user.email}`);

        // Proceed to the next middleware or route handler
        next();
    });
}

module.exports = { authenticateToken };
