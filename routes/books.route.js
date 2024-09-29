const express = require("express");
const booksController = require("../controllers/books.controller");

const booksRouter = express.Router();

booksRouter.get("/", booksController.getAllBooks);

booksRouter.post("/", booksController.addBook);

booksRouter.get("/:id", booksController.getBook);

booksRouter.put("/:id", booksController.updateBook);

booksRouter.delete("/:id", booksController.deleteBook);

module.exports = booksRouter;
