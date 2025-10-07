const fs = require("fs");

// Generic function to read data from a file
const readFile = (filePath) => {
    try {
        const data = fs.readFileSync(filePath, "utf-8");
        return JSON.parse(data);
    } catch (error) {
        console.error(`Error reading file at ${filePath}:`, error.message);
        throw new Error("File read error");
    }
};

// Generic function to write data to a file
const saveFile = (filePath, data) => {
    try {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
    } catch (error) {
        console.error(`Error writing file at ${filePath}:`, error.message);
        throw new Error("File write error");
    }
};




// Fetch all bonds
const getBonds = () => {
    try {
        return readFile("./data/bonds.json");
    } catch (error) {
        console.error("Error fetching bonds:", error.message);
        return [];
    }
};

// Add a new bond
const saveBond = (newBond) => {
    try {
        const bonds = getBonds();

        // Assign a unique ID to the new bond
        const id = bonds.length ? bonds[bonds.length - 1].id + 1 : 1;
        const bondToSave = { id, ...newBond };

        bonds.push(bondToSave);

        // Save the updated bond list
        saveFile("./data/bonds.json", bonds);

        return bondToSave;
    } catch (error) {
        console.error("Error saving bond:", error.message);
        throw new Error("Could not save bond.");
    }
};

// Update bond by ID
const updateBondById = (id, updatedBond) => {
    try {
        const bonds = getBonds();
        const bondIndex = bonds.findIndex((bond) => bond.id === id);

        if (bondIndex !== -1) {
            bonds[bondIndex] = { ...bonds[bondIndex], ...updatedBond };
            saveFile("./data/bonds.json", bonds);
            return true;
        }
        return false;
    } catch (error) {
        console.error("Error updating bond:", error.message);
        throw new Error("Could not update bond.");
    }
};

module.exports = { readFile, saveFile, getBonds, saveBond, updateBondById };
