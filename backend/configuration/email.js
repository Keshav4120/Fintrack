const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

// Path to the file where email logs will be stored
const emailLogsFilePath = path.join(__dirname, '../data/emailLogs.json');

// Ensure the data directory exists
const ensureDirectoryExists = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

ensureDirectoryExists(path.dirname(emailLogsFilePath));

// Use environment variables for credentials
const EMAIL_USER = process.env.EMAIL_USER || 'bansalankita468@gmail.com';
const EMAIL_PASS = process.env.EMAIL_PASS || 'vpvb mvut ryas utit';

// Set up Nodemailer transporter
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465, // 587 if using TLS
  secure: true, // true for 465, false for 587
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
  logger: true,
  debug: true,
});

// Function to read data from a file
const readData = (filePath) => {
  try {
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error(`Error reading data from ${filePath}:`, err);
    return [];
  }
};

// Function to write data to a file
const writeData = (filePath, data) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error(`Error writing data to ${filePath}:`, err);
  }
};

// Function to send email and store data in FS module
function sendEmail(to, subject, text, callback) {
  const mailOptions = {
    from: EMAIL_USER,
    to,
    subject,
    text,
  };

  console.log(`Attempting to send email to ${to} with subject: "${subject}"`);

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error sending email:', error);
      callback(error);
    } else {
      console.log('Email sent:', info.response);

      // Log email data to the file system
      const emailLogs = readData(emailLogsFilePath);
      emailLogs.push({
        recipient: to,
        subject,
        body: text,
        sentAt: new Date().toISOString(),
      });
      writeData(emailLogsFilePath, emailLogs);
      console.log('Email data stored successfully');
      callback(null, info);
    }
  });
}

module.exports = sendEmail;
