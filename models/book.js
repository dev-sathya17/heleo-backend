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
  // course: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "Course",
  //   required: true,
  //   validate: {
  //     validator: function (v) {
  //       return mongoose.Types.ObjectId.isValid(v);
  //     },
  //     message: "Invalid course ID",
  //   },
  // },
  isDeleted: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("Book", bookSchema, "books");
