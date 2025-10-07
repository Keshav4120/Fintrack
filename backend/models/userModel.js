const { readFile, writeFile } = require('../utils/file');

const createUserTable = async () => {
    try {
        const users = readFile('./data/users.json');
        if (users.length === 0) {
            writeFile('./data/users.json', [
                { id: 1, name: 'user1', email: 'user1@test.com', password: 'password1', role: 'customer' },
                { id: 2, name: 'user2', email: 'user2@test.com', password: 'password2', role: 'customer' },
                { id: 3, name: 'user3', email: 'user3@test.com', password: 'password3', role: 'customer' }
            ]);
            console.log('Temporary data inserted into Users file.');
        } else {
            console.log('Users file already has data.');
        }
    } catch (err) {
        console.error('Error initializing user data:', err);
    }
};

module.exports = {
    createUserTable
};
