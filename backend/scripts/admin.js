const bcrypt = require("bcrypt");
const { readFile, writeFile } = require("../utils/file");

async function createAdminAccounts() {
    try {
        const users = await readFile("./data/users.json"); // Ensure this is async if it's returning a promise
        
        // Check for existing admin accounts
        const existingAdmin = users.find(user => user.email === "admin@gmail.com");
        const existingFDAdmin = users.find(user => user.email === "fdadmin@gmail.com");
        const existingLoanAdmin = users.find(user => user.email === "loanadmin@gmail.com");

        let updated = false; // Track if any new user was added

        // Create general admin account if it doesn't exist
        if (!existingAdmin) {
            const newAdmin = {
                id: users.length + 1,
                email: "admin@gmail.com",
                name: "Admin",
                password: await bcrypt.hash("admin@123456", 10),
                role: "admin"
            };
            users.push(newAdmin);
            console.log("General Admin account created successfully");
            updated = true;
        } else {
            console.log("General Admin already exists");
        }

        // Create FD Admin account if it doesn't exist
        if (!existingFDAdmin) {
            const newFDAdmin = {
                id: users.length + 1,
                email: "fdadmin@gmail.com",
                name: "FD Admin",
                password: await bcrypt.hash("fdadmin@123456", 10),
                role: "fd_admin"
            };
            users.push(newFDAdmin);
            console.log("FD Admin account created successfully");
            updated = true;
        } else {
            console.log("FD Admin already exists");
        }

        // Create Loan Admin account if it doesn't exist
        if (!existingLoanAdmin) {
            const newLoanAdmin = {
                id: users.length + 1,
                email: "loanadmin@gmail.com",
                name: "Loan Admin",
                password: await bcrypt.hash("loanadmin@123456", 10),
                role: "loan_admin"
            };
            users.push(newLoanAdmin);
            console.log("Loan Admin account created successfully");
            updated = true;
        } else {
            console.log("Loan Admin already exists");
        }

        // Write updated users list to the file only if there's a change
        if (updated) {
            await writeFile("./data/users.json", users);
            console.log("Users data updated successfully");
        }

    } catch (error) {
        console.error("Error creating admin accounts:", error.message);
    }
}

module.exports = createAdminAccounts;
