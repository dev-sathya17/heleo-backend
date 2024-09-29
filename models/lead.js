const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema({
  // TODO: Attributes?
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    required: true,
  },
  // TODO: Same person Can ask for multiple courses
  course: {
    type: mongoose.Schema.ObjectId,
    ref: "Course",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Lead", leadSchema, "leads");
