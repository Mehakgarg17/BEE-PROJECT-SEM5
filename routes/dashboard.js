// routes/dashboard.js
const express = require('express');
const path = require('path');
const router = express.Router();

// Serve the dashboard page
router.get('/dashboard', (req, res) => {
    if (req.session.user) {
        res.sendFile(path.join(__dirname, '..', 'views', 'dashboard.html')); // Serve dashboard.html
    } else {
        res.redirect('/login'); // Redirect to login if not authenticated
    }
});

module.exports = router;
