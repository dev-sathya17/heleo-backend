const express = require("express");

const courseRouter = express.Router();

courseRouter.get("/");

courseRouter.post("/");

courseRouter.get("/:id");

courseRouter.put("/:id");

courseRouter.delete("/:id");

module.exports = courseRouter;
