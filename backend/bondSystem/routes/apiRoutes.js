const express = require("express");
const router = express.Router();


const { getAllBonds, addBond, updateBond } = require("../controllers/bondController");
const { purchaseBond, getUserPurchases,  getAllUserInvestments } = require("../controllers/purchaseController");
const { authenticateToken } = require("../../utils/authMiddleware");


// Bond Routes
router.get("/bonds", getAllBonds);
router.post("/bonds", authenticateToken, addBond);
router.put("/bonds/:id", authenticateToken, updateBond);

// Purchase Routes
router.post("/purchases", authenticateToken, purchaseBond);
router.get("/purchases", authenticateToken, getUserPurchases);

router.get("/admin/investments", authenticateToken, getAllUserInvestments); // Admin access only

module.exports = router;
