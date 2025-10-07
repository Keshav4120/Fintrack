// Import required modules
const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config(); // For loading environment variables
const otpService = require("./services/otpService"); 
const chatbotRoute = require('./stocks/chatbot/chatbot');
const indianchatbotRoute = require('./stocks/chatboti/chatboti');
const loginRoute = require("./services/login");
const signupRoute = require("./services/signup");
const userRoute = require("./services/user");
const usRou = require('./routes/userRoutes');
const apiRoutes = require("./bondSystem/routes/apiRoutes");
const connectDB = require("./db");

const {
    getApprovedLoans,
    approveLoan,
    estimateLoan
} = require("./loan/loanController");
const {
    getFDs,
    addFD,
    updateFD,
    deleteFD,
    buyFD,
    sellFD
} = require("./fd/fdController");
const createAdminAccount = require("./scripts/admin");
const { 
    setEmailInSession,
    getIndianStocks,
    getUSStocks,
    addIndianStock,
    addUSStock,
    deleteIndianStock,
    deleteUSStock,
    modifyIndianStock,
    modifyUSStock,
    scheduleLivePriceUpdates
  } = require('./stocks/stockController');

// Initialize the app and configure the port
const app = express();
const PORT = process.env.PORT || 3001; // Port for other services // Default to port 3001 or use one from the environment
connectDB();
// Middleware setup
app.use(cors()); // Enable CORS for cross-origin requests
app.use(bodyParser.json()); // For parsing JSON request bodies

// Route to set email in session
app.post('/api/recieve-email', setEmailInSession);
app.use(express.json({ limit: "25mb" })); // To handle large payloads
app.use(express.urlencoded({ extended: true, limit: "25mb" }));

// Ensure admin account creation before server starts
(async () => {
    try {
        await createAdminAccount(); // Ensure admin account creation
    } catch (error) {
        console.error("Error ensuring admin account:", error.message);
    }
})();

// Authentication and User Routes
app.use("/user", signupRoute); // User signup
app.use("/auth", loginRoute); // User login
app.use("/api/users", userRoute); // User-related operations
app.use("/api", apiRoutes); // Bond system related routes
app.use('/api/user', usRou);
// FD Routes
app.get("/api/fds", getFDs); // Get list of Fixed Deposits (FDs)
app.post("/api/fds", addFD); // Add new FD
app.put("/api/fds/:id", updateFD); // Update FD
app.delete("/api/fds/:id", deleteFD); // Delete FD

// Routes for buying and selling FDs
app.post("/api/fds/buy", buyFD); // Buy an FD
app.post("/api/fds/sell", sellFD); // Sell an FD

// Stock Routes
app.get('/api/stocks/indian', getIndianStocks);
app.get('/api/stocks/us', getUSStocks);
app.post('/api/stocks/indian', addIndianStock);
app.post('/api/stocks/us', addUSStock);
app.delete('/api/stocks/indian/:id', deleteIndianStock);
app.delete('/api/stocks/us/:id', deleteUSStock);
app.put('/api/stocks/indian/:id', modifyIndianStock);
app.put('/api/stocks/us/:id', modifyUSStock);

// Priority Stock Routes
app.get('/api/stocks/indian/priority', async (req, res) => {
    try {
      const stocks = await getStocksByPriority('indian');
      res.json(stocks);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  });
  
  // Chatbot for Stocks
  app.use('/api', chatbotRoute);
  app.use('/api', indianchatbotRoute);
  app.get('/api/stocks/us/priority', async (req, res) => {
    try {
      const stocks = await getStocksByPriority('us');
      res.json(stocks);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  });
  
// OTP Routes
app.post("/api/forgot-password", otpService.forgotPassword); // Request OTP
app.post("/api/verify-otp", otpService.verifyOTP);           // Verify OTP
app.post("/api/reset-password", otpService.resetPassword);   // Reset password

// Loan Routes
app.get("/api/loans/approve", getApprovedLoans); // Get all approved loans
app.post("/api/loans/approve", approveLoan); // Approve a new loan
app.post("/api/loans/estimate", estimateLoan); // Estimate loan amount based on portfolio size or bank statement

// Email sending function
function sendEmail(email) {
    return new Promise((resolve, reject) => {
        var transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "bansalankita468@gmail.com",
                pass: "vpvb mvut ryas utit", // Replace this with environment variable
            },
        });
        const mailConfigs = {
            from: process.env.EMAIL_USER, // Send from the same email account
            to: `${email}`, // Multiple email addresses in a string
            subject: "fd services",
            text: "Welcome to our Fixed Deposit service, where your investments are secured, grow with attractive interest rates, and are easily managed through flexible tenure options..",
        };
        transporter.sendMail(mailConfigs, (error, info) => {
            if (error) {
                console.error(error);
                return reject({ message: "Error sending email" });
            }
            console.log("Email sent: " + info.response);
            return resolve({ message: "Email sent successfully" });
        });
    });
}


// Root route
app.get("/", (req, res) => {
    res.send("Welcome to the Dev@Deakin application");
});

// Route to handle email sending
app.post("/send", (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).send("Email is missing");
    }
    sendEmail(email)
        .then((response) => res.send(response))
        .catch((error) => res.status(500).send(error));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
