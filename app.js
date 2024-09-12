const express = require('express');
const path = require('path');
const session = require('express-session');

const app = express();

// Middleware to parse URL-encoded data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Set up session middleware
app.use(session({
    secret: 'your-secret-key', // Replace with a strong secret
    resave: false,
    saveUninitialized: true,
}));

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve static files from the "views" directory
app.use(express.static(path.join(__dirname, 'views')));
app.use(express.static(path.join(__dirname, 'images')));
// Routers
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const dashboardRouter = require('./routes/dashboard');
const booksRouter = require('./routes/books');
const updateProfileRouter = require('./routes/update-profile'); // Include update-profile router
const profileRouter = require('./routes/profile');

app.use('/', indexRouter);
app.use('/', usersRouter);
app.use('/', dashboardRouter);
app.use('/', booksRouter);
app.use('/', updateProfileRouter); // Use update-profile router
app.use('/', profileRouter);


const PORT = process.env.PORT || 3210;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
