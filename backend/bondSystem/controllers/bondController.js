const { getBonds, saveBond, updateBondById } = require("../models/bondModel");

// Get all bonds
const getAllBonds = async (req, res) => {
    try {
        const bonds = getBonds();
        res.status(200).json(bonds);
    } catch (error) {
        res.status(500).json({ message: "Error fetching bonds.", error: error.message });
    }
};

// Add a new bond (Admin only)
const addBond = async (req, res) => {
    try {
        // Only admins can add bonds
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Only admin can add bonds." });
        }

        const newBond = req.body;

        // Add the bond using the saveBond function
        const addedBond = saveBond(newBond);
        res.status(201).json({ message: "Bond added successfully.", bond: addedBond });
    } catch (error) {
        res.status(500).json({ message: "Error adding bond.", error: error.message });
    }
};

// Update an existing bond (Admin only)
const updateBond = async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Only admin can update bonds." });
        }

        const bondId = parseInt(req.params.id);
        const updatedBond = req.body;

        const result = updateBondById(bondId, updatedBond);

        if (result) {
            res.status(200).json({ message: "Bond updated successfully.", bond: updatedBond });
        } else {
            res.status(404).json({ message: "Bond not found." });
        }
    } catch (error) {
        res.status(500).json({ message: "Error updating bond.", error: error.message });
    }
};

module.exports = { getAllBonds, addBond, updateBond };
