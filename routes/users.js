// const express = require('express');
// const fs = require('fs');
// const path = require('path');
// const router = express.Router();

// // Path to the data.json file
// const dataFilePath = path.join(__dirname, '../data.json');

// // Helper function to read data from data.json
// const readData = () => {
//     return JSON.parse(fs.readFileSync(dataFilePath, 'utf8'));
// };

// // Helper function to write data to data.json
// const writeData = (data) => {
//     fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), 'utf8');
// };

// // Route for user registration
// router.post('/register', (req, res) => {
//     const { name, email, password, dob, age, address } = req.body;
//     const users = readData();

//     // Check if the user already exists
//     const userExists = users.some(user => user.email === email);
//     if (userExists) {
//         return res.send('User already exists. Please login.');
//     }

//     // Store the new user with additional details
//     users.push({ name, email, password, dob, age, address });
//     writeData(users);
//     res.redirect('/login'); // Redirect to the login page after registration
// });

// // Route for user login
// router.post('/login', (req, res) => {
//     const { email, password } = req.body;
//     const users = readData();

//     // Check if the user exists
//     let user = users.find(user => user.email === email);

//     if (!user) {
//         // If the user doesn't exist, prompt for registration
//         return res.send('User not registered. Please register first.');
//     } else if (user.password !== password) {
//         // If the password doesn't match, send an error
//         return res.send('Invalid email or password.');
//     }

//     // Store user in session
//     req.session.user = user;
//     res.redirect('/dashboard'); // Redirect to the dashboard page after login
// });

// // Route to display the profile page
// router.get('/profile', (req, res) => {
//     if (!req.session.user) {
//         return res.redirect('/login'); // Redirect to login if not logged in
//     }
//     res.sendFile(path.join(__dirname, '../views/profile.html'));
// });

// // Route for fetching user data
// router.get('/user-data', (req, res) => {
//     const user = req.session.user;
//     if (!user) {
//         return res.status(401).json({ error: 'User not authenticated' });
//     }
//     res.json(user);
// });

// // Route for updating user profile
// router.post('/update-profile', (req, res) => {
//     const { name, dob, age, address } = req.body;
//     const userEmail = req.session.user.email;
//     const users = readData();
//     const userIndex = users.findIndex(user => user.email === userEmail);

//     if (userIndex === -1) {
//         return res.status(404).json({ success: false, message: 'User not found.' });
//     }

//     // Update user details
//     users[userIndex] = { ...users[userIndex], name, dob, age, address };
//     writeData(users);
//     req.session.user = users[userIndex]; // Update session
//     res.json({ success: true });
// });

// // Logout route
// router.get('/logout', (req, res) => {
//     req.session.destroy(err => {
//         if (err) {
//             return res.send('Error logging out.');
//         }
//         res.redirect('/login');
//     });
// });

// module.exports = router;
const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

// Paths to the data.json and login.json files
const dataFilePath = path.join(__dirname, '../data.json');
const loginFilePath = path.join(__dirname, '../login.json');

// Helper function to read data from a JSON file
const readData = (filePath) => {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
};

// Helper function to write data to a JSON file
const writeData = (filePath, data) => {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
};

// Route for user registration
router.post('/register', (req, res) => {
    const { name, email, password, dob, age, address } = req.body;
    const users = readData(dataFilePath);

    // Check if the user already exists
    const userExists = users.some(user => user.email === email);
    if (userExists) {
        return res.send('User already exists. Please login.');
    }

    // Store the new user with additional details in data.json
    users.push({ name, email, password, dob, age, address });
    writeData(dataFilePath, users);
    res.redirect('/login'); // Redirect to the login page after registration
});

// Route for user login
router.post('/login', (req, res) => {
    const { email, password } = req.body;
    const users = readData(loginFilePath);

    // Check if the user exists in login.json
    let user = users.find(user => user.email === email);

    if (!user) {
        // If the user doesn't exist, check in data.json and add to login.json if found
        const registeredUsers = readData(dataFilePath);
        user = registeredUsers.find(user => user.email === email);
        if (!user) {
            return res.send('User not registered. Please register first.');
        }

        // Store user in login.json for future logins
        users.push(user);
        writeData(loginFilePath, users);
    } else if (user.password !== password) {
        // If the password doesn't match, send an error
        return res.send('Invalid email or password.');
    }

    // Store user in session
    req.session.user = user;
    res.redirect('/dashboard'); // Redirect to the dashboard page after login
});

// Route to display the profile page
router.get('/profile', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login'); // Redirect to login if not logged in
    }
    res.sendFile(path.join(__dirname, '../views/profile.html'));
});

// Route for fetching user data
router.get('/user-data', (req, res) => {
    const user = req.session.user;
    if (!user) {
        return res.status(401).json({ error: 'User not authenticated' });
    }
    res.json(user);
});

// Route for updating user profile
router.post('/update-profile', (req, res) => {
    const { name, dob, age, address } = req.body;
    const userEmail = req.session.user.email;
    
    // Update data.json
    const registeredUsers = readData(dataFilePath);
    const userIndex = registeredUsers.findIndex(user => user.email === userEmail);
    if (userIndex === -1) {
        return res.status(404).json({ success: false, message: 'User not found.' });
    }

    // Update user details in data.json
    registeredUsers[userIndex] = { ...registeredUsers[userIndex], name, dob, age, address };
    writeData(dataFilePath, registeredUsers);

    // Update session and login.json
    req.session.user = registeredUsers[userIndex];
    let loggedInUsers = readData(loginFilePath);
    const loggedInUserIndex = loggedInUsers.findIndex(user => user.email === userEmail);
    if (loggedInUserIndex !== -1) {
        loggedInUsers[loggedInUserIndex] = { ...loggedInUsers[loggedInUserIndex], name, dob, age, address };
        writeData(loginFilePath, loggedInUsers);
    }

    res.json({ success: true });
});

// Logout route
router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.send('Error logging out.');
        }
        res.redirect('/login');
    });
});

module.exports = router;
