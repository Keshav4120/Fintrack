const express = require("express");
const router = express.Router();
const { getUsernames } = require("../controllers/userController");
const fs = require("fs");
const path = require("path");

// Route for getting usernames
router.get("/usernames", getUsernames);

// Route for submitting profile
router.post("/submitProfile", (req, res) => {
  const filePath = "./data/registration_data.json";

  // Read the existing JSON data
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading file:", err);
      return;
    }

    let jsonData = {};

    // Parse the existing JSON data if the file is not empty
    if (data) {
      jsonData = JSON.parse(data);
    }

    // Add the new profileData object to the JSON object
    const profileData = req.body;
    const newKey = Object.keys(jsonData).length; // Determine the new key based on the existing number of keys
    jsonData[newKey] = profileData;

    // Write the updated JSON data back to the file
    fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), (err) => {
      if (err) {
        console.error("Error writing to file:", err);
      } else {
        console.log("Data successfully appended to file.");
      }
    });
  });

  // Handle the profile data here (e.g., save to database or file)
  res.send("Profile submitted successfully!");
});

module.exports = router;
