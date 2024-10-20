const express = require("express");
const booksController = require("../controllers/books.controller");
const auth = require("../middlewares/auth");
const booksRouter = express.Router();

booksRouter.get(
  "/",
  auth.authenticate,
  // auth.authorize,
  booksController.getAllBooks
);

booksRouter.post(
  "/",
  auth.authenticate,
  // auth.authorize,
  booksController.addBook
);

booksRouter.get(
  "/:id",
  auth.authenticate,
  // auth.authorize,
  booksController.getBook
);

booksRouter.put(
  "/:id",
  auth.authenticate,
  // auth.authorize,
  booksController.updateBook
);

booksRouter.delete(
  "/:id",
  auth.authenticate,
  // auth.authorize,
  booksController.deleteBook
);

module.exports = booksRouter;
