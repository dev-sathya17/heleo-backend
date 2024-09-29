const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  // Todo: Attributes?
  title: { type: String, required: true },
  author: { type: String, required: true },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Book", bookSchema, "books");
