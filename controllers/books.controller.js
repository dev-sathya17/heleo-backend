const Book = require("../models/book");

const booksController = {
  addBook: async (req, res) => {
    try {
      const { title, author } = req.body;
      const newBook = new Book({ title, author });
      const savedBook = await newBook.save();
      res.status(201).json(savedBook);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },
  getAllBooks: async (req, res) => {
    try {
      const books = await Book.find();
      res.status(200).json(books);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
  getBook: async (req, res) => {
    try {
      const book = await Book.findById(req.params.id);
      if (!book) {
        return res.status(404).json({ message: "Book not found" });
      }
      res.status(200).json(book);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
  updateBook: async (req, res) => {
    try {
      const { title, author } = req.body;
      const book = await Book.findById(req.params.id);

      if (!book) {
        return res.status(404).json({ message: "Book not found" });
      }

      book.title = title || book.title;
      book.author = author || book.author;
      book.updatedAt = Date.now();

      const updatedBook = await book.save();

      res.status(200).json(updatedBook);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },
  deleteBook: async (req, res) => {
    try {
      const deletedBook = await Book.findByIdAndDelete(req.params.id);
      if (!deletedBook) {
        return res.status(404).json({ message: "Book not found" });
      }

      res.status(200).json({ message: "Book deleted successfully" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
};

module.exports = booksController;
