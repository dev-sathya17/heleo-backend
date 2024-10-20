const express = require("express");
const courseController = require("../controllers/course.controller");
const auth = require("../middlewares/auth");
const courseRouter = express.Router();

courseRouter.get(
  "/",
  auth.authenticate,
  // // auth.authorize,
  courseController.getAllCourses
);

courseRouter.post(
  "/",
  auth.authenticate,
  // // auth.authorize,
  courseController.addCourse
);

courseRouter.get(
  "/:id",
  auth.authenticate,
  // // auth.authorize,
  courseController.getCourse
);

courseRouter.put(
  "/:id",
  auth.authenticate,
  // // auth.authorize,
  courseController.updateCourse
);

courseRouter.delete(
  "/:id",
  auth.authenticate,
  // // auth.authorize,
  courseController.deleteCourse
);

module.exports = courseRouter;
