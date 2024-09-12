const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// Path to the books.json file
const booksFilePath = path.join(__dirname, '../books.json');

// Helper function to read data from books.json
const readBooks = () => {
    try {
        return JSON.parse(fs.readFileSync(booksFilePath, 'utf8'));
    } catch (error) {
        console.error('Error reading books.json:', error);
        return [];
    }
};

// Helper function to write data to books.json
const writeBooks = (data) => {
    try {
        fs.writeFileSync(booksFilePath, JSON.stringify(data, null, 2), 'utf8');
    } catch (error) {
        console.error('Error writing to books.json:', error);
    }
};

// Serve the books page
router.get('/books.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/books.html'));
});

// API to get all books
router.get('/books', (req, res) => {
    const books = readBooks();
    res.json(books);
});

// API to add a new book

router.post('/books', (req, res) => {
    const { title, author, genre, available } = req.body;

    if (!title || !author || !genre || available === undefined) {
        return res.status(400).send('Missing required fields');
    }

    const books = readBooks();
    const newBook = {
        id: books.length + 1,
        title,
        author,
        genre,
        available
    };
    books.push(newBook);
    writeBooks(books);
    res.status(201).json(newBook);
});

// API to remove a book
router.delete('/books/:id', (req, res) => {
    let books = readBooks();
    const id = parseInt(req.params.id);

    if (!books.some(book => book.id === id)) {
        return res.status(404).send('Book not found');
    }

    books = books.filter(book => book.id !== id);
    writeBooks(books);
    res.status(204).send(); // No content
});

// API to update a book
router.put('/books/:id', (req, res) => {
    const { title, author, genre, available, imageUrl } = req.body;
    let books = readBooks();
    const id = parseInt(req.params.id);

    let book = books.find(book => book.id === id);
    if (book) {
        book.title = title || book.title;
        book.author = author || book.author;
        book.genre = genre || book.genre;
        book.available = available !== undefined ? available : book.available; // Treat 'available' like other fields
        book.imageUrl = imageUrl || book.imageUrl;
        writeBooks(books);
        res.json(book);
    } else {
        res.status(404).send('Book not found');
    }
});

module.exports = router;
