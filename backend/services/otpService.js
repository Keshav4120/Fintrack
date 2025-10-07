const nodemailer = require('nodemailer');
const crypto = require('crypto'); // To generate OTPs
const otpMap = new Map(); // Temporary storage for OTPs (Replace with Redis or DB for production)
const UserModel = require('../models/userModel'); // Assuming you have a user model to interact with your database
const bcrypt = require('bcrypt');
const users = require('../data/users.json')

// Configure Nodemailer
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'financeapp44@gmail.com',   // Use email from environment variable
        pass: 'tklz lutf mjhg czfs'   // Use app password from environment variable
    },
    tls: {
        rejectUnauthorized: false,
    },
});

// Generate OTP and send email
const forgotPassword = async (req, res) => {
    const { email } = req.body;
    const user =  users?.find(i=>i.email==email)
    console.log(email)
    if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
    }

    const otp = crypto.randomInt(100000, 999999); // Generate 6-digit OTP
    const expiresAt = Date.now() + 15 * 60 * 1000; // OTP valid for 15 minutes
    otpMap.set(email, { otp, expiresAt });

    // Send email
    const mailOptions = {
        from: 'financeapp44@gmail.com',
        to: email,
        subject: 'Password Reset OTP',
        text: `Your OTP for password reset is ${otp}. It will expire in 15 minutes.`,
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ success: true, message: 'OTP sent to your email' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ success: false, message: 'Error sending OTP' });
    }
};

const verifyOTP = (req, res) => {
    const { email, otp } = req.body;

    if (!otpMap.has(email)) {
        return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
    }

    const { otp: storedOtp, expiresAt } = otpMap.get(email);

    if (Date.now() > expiresAt) {
        otpMap.delete(email);
        return res.status(400).json({ success: false, message: 'OTP expired' });
    }

    if (parseInt(otp, 10) !== storedOtp) {
        return res.status(400).json({ success: false, message: 'Incorrect OTP' });
    }

    otpMap.delete(email);
    res.status(200).json({ success: true, message: 'OTP verified successfully' });
};

const fs = require("fs"); // Add this at the top of otpService.js

const resetPassword = async (req, res) => {
    const { email, password } = req.body;

    console.log('Reset Password Request:', { email, password });

    if (!email || !password) {
        console.error('Invalid input: email or password missing');
        return res.status(400).json({ success: false, message: 'Email and new password are required' });
    }

    try {
        const user = users.find(i => i.email === email);
        if (!user) {
            console.error('User not found for email:', email);
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        console.log('User found:', user);

        // const saltRounds = 10;
        // const hashedPassword = await bcrypt.hash(password, saltRounds);

        // console.log('Password hashed successfully');

        // Update user's password
        user.password = password;

        // Persist updated data to the file
        fs.writeFileSync('./data/users.json', JSON.stringify(users, null, 2), "utf-8");
        console.log('User data updated in users.json');

        res.status(200).json({ success: true, message: 'Password reset successfully' });
    } catch (error) {
        console.error('Error resetting password:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

module.exports = {
    forgotPassword,
    verifyOTP,
    resetPassword,
};

