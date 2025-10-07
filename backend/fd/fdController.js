const FD = require('../models/fdModel'); // Import the FD model

// Function to get all FDs
const getFDs = async (req, res) => {
    try {
        const fds = await FD.find(); // Fetch all FDs
        res.json(fds);
    } catch (err) {
        console.error('Error fetching FDs:', err);
        res.status(500).json({ error: 'Failed to fetch FDs' });
    }
};

// Function to add a new FD
const addFD = async (req, res) => {
    try {
        const { name, tenure, interest, minInvestment, balance = 0 } = req.body;

        // Create and save the new FD
        const newFD = new FD({ name, tenure, interest, minInvestment, balance });
        const savedFD = await newFD.save();

        res.status(201).json(savedFD);
    } catch (err) {
        console.error('Error adding FD:', err);
        res.status(500).json({ error: 'Failed to add FD' });
    }
};

// Function to update an FD
const updateFD = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedData = req.body;

        // Find and update the FD
        const updatedFD = await FD.findByIdAndUpdate(id, updatedData, { new: true });

        if (!updatedFD) {
            return res.status(404).json({ error: 'FD not found' });
        }

        res.json(updatedFD);
    } catch (err) {
        console.error('Error updating FD:', err);
        res.status(500).json({ error: 'Failed to update FD' });
    }
};

const deleteFD = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if the id is provided
    if (!id) {
      return res.status(400).json({ error: 'FD id is required' });
    }

    // Validate if id is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid FD id format' });
    }

    // Attempt to delete the FD
    const result = await FD.findByIdAndDelete(id);

    if (!result) {
      return res.status(404).json({ error: 'FD not found' });
    }

    res.status(200).json({ message: 'FD deleted successfully' });
  } catch (err) {
    console.error('Error deleting FD:', err);
    res.status(500).json({ error: 'Failed to delete FD' });
  }
};


// Function to "buy" an FD
const buyFD = async (req, res) => {
    try {
        const { id, amount } = req.body;

        // Find the FD
        const fd = await FD.findById(id);

        if (!fd) {
            return res.status(404).json({ error: 'FD not found' });
        }

        // Check if there is enough balance
        if (amount > fd.balance) {
            return res.status(400).json({ error: 'Not enough FD balance available' });
        }

        // Deduct the amount
        fd.balance -= amount;
        const updatedFD = await fd.save();

        res.status(200).json({ message: 'FD bought successfully', fd: updatedFD });
    } catch (err) {
        console.error('Error buying FD:', err);
        res.status(500).json({ error: 'Failed to buy FD' });
    }
};

// Function to "sell" an FD
const sellFD = async (req, res) => {
    try {
        const { id, amount } = req.body;

        // Find the FD
        const fd = await FD.findById(id);

        if (!fd) {
            return res.status(404).json({ error: 'FD not found' });
        }

        // Add the amount back to balance
        fd.balance += amount;
        const updatedFD = await fd.save();

        res.status(200).json({ message: 'FD sold successfully', fd: updatedFD });
    } catch (err) {
        console.error('Error selling FD:', err);
        res.status(500).json({ error: 'Failed to sell FD' });
    }
};

module.exports = { getFDs, addFD, updateFD, deleteFD, buyFD, sellFD };