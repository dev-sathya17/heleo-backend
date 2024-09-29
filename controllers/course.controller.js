const Course = require("../models/course");

const courseController = {
  addCourse: async (req, res) => {
    try {
      const { title, description, duration, books } = req.body;
      const newCourse = new Course({ title, description, duration, books });
      const savedCourse = await newCourse.save();
      res.status(201).json(savedCourse);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },
  getAllCourses: async (req, res) => {
    try {
      const courses = await Course.find().populate("books"); // Populate books references
      res.status(200).json(courses);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
  getCourse: async (req, res) => {
    try {
      const course = await Course.findById(req.params.id).populate("books");
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
      res.status(200).json(course);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
  updateCourse: async (req, res) => {
    try {
      const { title, description, duration, books } = req.body;
      const course = await Course.findById(req.params.id);
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }

      course.title = title || course.title;
      course.description = description || course.description;
      course.duration = duration || course.duration;
      course.books = books || course.books; // Revisit array handling of books updation

      const updatedCourse = await course.save();

      res.status(200).json(updatedCourse);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },
  deleteCourse: async (req, res) => {
    try {
      const deletedCourse = await Course.findByIdAndDelete(req.params.id);
      if (!deletedCourse) {
        return res.status(404).json({ message: "Course not found" });
      }
      res.status(200).json({ message: "Course deleted successfully" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
};

module.exports = courseController;
