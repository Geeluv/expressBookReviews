const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  let userValid = true;
  if (users.length > 0) {
    users.map(user => {
      if (user.username === username) {
        userValid = false
      } else {
        userValid = true
      }
    })
  }
  return userValid;
}

const authenticatedUser = (username, password) => {
  users.map(user => {
    if (user.username === username && user.password === password) {
      return true;
    } else {
      return false;
    }
  })
}

//only registered users can login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (!(username && password)) {
    return res.status(404).json({ message: "Provide username and password" });
  }
  const isAuth = authenticatedUser(username, password)
  if (!isAuth) {
    let accessToken = jwt.sign({ username, password }, 'jwtsecret', { expiresIn: 60 * 60 });
    req.session.authorization = { accessToken }
    return res.status(200).json({ message: "User has been logged in" });
  }
  return res.status(400).json({ message: "Invalid credentials" });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const { review } = req.body;
  const { isbn } = req.params;
  let reviewedBook;
  for (let key in books) {
    if (key === isbn) {
      reviewedBook = books[key].title
      books[key].reviews[req.user.username] = review;
    }
  }
  return res.status(200).json({ message: `You just added/updated your review on the book ${reviewedBook} with the ISBN ${isbn}`, book: books });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  for (let key in books) {
    if (key === isbn) {
      delete books[key].reviews[req.user.username]
    }
  }
  return res.status(200).json({ message: `Review for the ISBN ${isbn} posted by ${req.user.username} has been deleted` })
})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;