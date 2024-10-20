const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema({
  // TODO: Attributes?
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
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
  location: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  source: {
    type: String,
    required: true,
  },
  forSelf: {
    type: Boolean,
    required: true,
  },
  remarks: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  // TODO: Status for lead, ask for values
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("Lead", leadSchema, "leads");
