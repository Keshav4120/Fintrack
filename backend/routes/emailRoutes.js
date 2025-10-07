const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');
const sendEmail = require('../email/emailSend');

// Path to the file where email logs are stored
const emailLogsFilePath = path.join(__dirname, '../data/emailLogs.json');

// Utility function to ensure the log file exists
const ensureFileExists = async (filePath) => {
  try {
    await fs.access(filePath);
  } catch (err) {
    // If the file does not exist, create an empty JSON array
    await fs.writeFile(filePath, JSON.stringify([], null, 2));
  }
};

// Utility function to read data from a file
const readData = async (filePath) => {
  try {
    await ensureFileExists(filePath);
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error(`Error reading data from ${filePath}:`, err);
    return [];
  }
};

// Utility function to write data to a file
const writeData = async (filePath, data) => {
  try {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error(`Error writing data to ${filePath}:`, err);
  }
};

// Validate email format
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Route to send an email
router.post('/send', async (req, res) => {
  const { to, subject, text } = req.body;

  // Validate required fields
  if (!to || !subject || !text) {
    return res.status(400).json({ error: 'All fields are required: to, subject, text' });
  }

  // Validate email format
  if (!isValidEmail(to)) {
    return res.status(400).json({ error: 'Invalid email address' });
  }

  // Send the email
  try {
    await sendEmail(to, subject, text);

    // Log the email details
    const emailLog = {
      to,
      subject,
      text,
      timestamp: new Date().toISOString(),
    };

    const emailLogs = await readData(emailLogsFilePath);
    emailLogs.push(emailLog);
    await writeData(emailLogsFilePath, emailLogs);

    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to send email', details: error.message });
  }
});

// Route to get email logs
const getFDs = async (req, res) => {
  try {
    const fdData = await readJSONFile(fdDataFilePath);
    res.json(fdData);
  } catch (err) {
    console.error('Error reading FD data:', err);
    res.status(500).json({ error: 'Failed to load FD data' });
  }
};

module.exports = {
  getFDs,
  addFD,
  updateFD,
  deleteFD,
  buyFD,
  sellFD
};
