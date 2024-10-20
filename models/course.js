const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  // TODO: attributes?
  title: { type: String, required: true },
  description: { type: String, required: true },
  duration: { type: Number, required: true },
  // price: { type: Number, required: true },
  // instructor: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "User",
  //   required: true,
  // },
  // students: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  // books: [{ type: mongoose.Schema.Types.ObjectId, ref: "Book" }], ?not needed for now
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  courseFee: {
    type: Number,
    required: true,
    default: 0,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("Course", courseSchema, "courses");
