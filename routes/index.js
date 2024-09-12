const express = require('express');
const router = express.Router();
const path = require('path');

// Redirect root URL to login page
router.get('/', (req, res) => {
    res.redirect('/login'); // Redirect to the login page
});

// Serve the registration page
router.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/register.html')); // Serve the registration HTML file
});

// Serve the login page
router.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/login.html')); // Serve the login HTML file
});

// Serve the home page
router.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/home.html')); // Serve the home HTML file
});

module.exports = router;