const { readFile } = require('../utils/file');

const getUsernames = (req, res) => {
    try {
        const users = readFile('./data/registration_data.json');
        // const usernames = users.map(user => user.name); // Updated to match user data
        res.status(200).json(users);
    } catch (err) {
        console.error('Error fetching usernames:', err);
        res.status(500).send('Server error');
    }
};

module.exports = {
    getUsernames
};
