const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

// Adjust the path to match the location of interests.json
const interestsFilePath = path.join(__dirname, '../interests.json'); // Adjust path if needed

// Helper function to read data from interests.json
const readInterests = () => {
    try {
        if (fs.existsSync(interestsFilePath)) {
            const data = fs.readFileSync(interestsFilePath, 'utf8');
            return JSON.parse(data);
        }
        return [];
    } catch (error) {
        console.error('Error reading interests file:', error);
        throw new Error('Error reading interests file');
    }
};

// Helper function to write data to interests.json
const writeInterests = (data) => {
    try {
        fs.writeFileSync(interestsFilePath, JSON.stringify(data, null, 2), 'utf8');
        console.log('Data written to file successfully');
    } catch (error) {
        console.error('Error writing to interests file:', error);
        throw new Error('Error writing to interests file');
    }
};

// Route to update genreInterest by user email
router.post('/update-genre-interest', (req, res) => {
    const { email, genreInterest } = req.body;

    // Log received data for debugging
    console.log('Received data:', { email, genreInterest });

    // Validate input
    if (!email || !Array.isArray(genreInterest)) {
        return res.status(400).send('Invalid input data.');
    }

    try {
        // Read existing interests
        const allInterests = readInterests();
        console.log('Current interests:', allInterests);

        // Find the user by email
        const user = allInterests.find(user => user.email === email);

        if (user) {
            // Update genre interests
            user.genreInterest = genreInterest;
            console.log('Updated user:', user);

            // Write updated interests back to file
            writeInterests(allInterests);

            return res.send('Genre interests updated successfully.');
        } else {
            return res.status(404).send('User not found.');
        }
    } catch (error) {
        console.error('Failed to update genre interests:', error);
        return res.status(500).send('Failed to update genre interests. Please try again.');
    }
});

module.exports = router;
