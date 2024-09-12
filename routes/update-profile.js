// routes/update-profile.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

// Load user data from data.json
function loadUserData() {
    const filePath = path.join(__dirname, '..', 'data.json');
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

// Save user data to data.json
function saveUserData(data) {
    const filePath = path.join(__dirname, '..', 'data.json');
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
}

// Serve the update profile page
router.get('/update-profile', (req, res) => {
    if (req.session.user) {
        const userData = loadUserData();
        const user = userData[req.session.user.username]; // Assuming username is used as key
        res.render('update-profile', { user }); // Render update-profile.html with user data
    } else {
        res.redirect('/login'); // Redirect to login if not authenticated
    }
});

// Handle profile update form submission
// router.post('/update-profile', (req, res) => {
//     if (req.session.user) {
//         const userData = loadUserData();
//         const { username } = req.session.user;
//         const { name, email, address,age,password,dateOfBirth } = req.body;

//         if (userData[username]) {
//             // Update user data
//             userData[username].name = name;
//             userData[username].email = email;
//             userData[username].address = address;
//             userData[username].age = age;
//             userData[username].password = password;
//             userData[username].dateOfBirth = dateOfBirth;
//             saveUserData(userData);

//             // Update session data if needed
//             req.session.user.name = name;

//             res.redirect('/dashboard'); // Redirect to dashboard after update
//         } else {
//             res.redirect('/update-profile'); // Redirect back to update profile if user not found
//         }
//     } else {
//         res.redirect('/login'); // Redirect to login if not authenticated
//     }
// });
router.post('/update-profile', (req, res) => {
    if (!req.session.user) {
        console.log('User not authenticated');
        return res.status(401).json({ success: false, message: 'User not authenticated.' });
    }

    console.log('Session user:', req.session.user); // Debugging line

    const { name, dob, age, address } = req.body;
    const userEmail = req.session.user.email;
    const users = readData();
    const userIndex = users.findIndex(user => user.email === userEmail);

    if (userIndex === -1) {
        console.log('User not found in database');
        return res.status(404).json({ success: false, message: 'User not found.' });
    }

    // Update user details
    users[userIndex] = { ...users[userIndex], name, dob, age, address };
    writeData(users);
    req.session.user = users[userIndex]; // Update session
    res.json({ success: true });
});


module.exports = router;
