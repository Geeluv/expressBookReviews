const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const { username, password } = req.body;
  if (username && password) {
    if (isValid(username)) {
      users.push({ username, password });
      return res.status(200).json({ message: "User successfully registered. You can now login" })
    } else {
      return res.status(400).json({ message: "Username already exists" })
    }
  } else {
    return res.status(400).json({ message: "Username and Password must be provided" })
  }
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  return res.status(200).json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const { isbn } = req.params;
  let booksByIsbn;
  for (let key in books) {
    if (key === isbn) {
      booksByIsbn = books[key];
    }
  }
  return res.status(200).json(booksByIsbn);
})

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const { author } = req.params;
  let booksByAuthor = [];
  for (let key in books) {
    if (books.hasOwnProperty(key)) {
      let book = books[key];
      if (book.author === author) {
        booksByAuthor.push(book)
      }
    }
  }
  return res.status(200).json(booksByAuthor);
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const { title } = req.params;
  let booksByTitle = [];
  for (let key in books) {
    if (books.hasOwnProperty(key)) {
      let book = books[key];
      if (book.title === title) {
        booksByTitle.push(book)
      }
    }
  }
  return res.status(200).json(booksByTitle);
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  const { isbn } = req.params;
  let booksByIsbn;
  for (let key in books) {
    if (key === isbn) {
      booksByIsbn = books[key].reviews;
    }
  }
  return res.status(200).json(booksByIsbn)
});

module.exports.general = public_users;