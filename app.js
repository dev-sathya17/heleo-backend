// Importing the express library
const express = require("express");

// Importing the morgan library to log requests
const morgan = require("morgan");

// Importing the cookie parser library
const cookieParser = require("cookie-parser");

const cors = require("cors");

// Creating an express application
const app = express();

// Importing the necessary routers
const userRouter = require("./routes/user.route");
const booksRouter = require("./routes/books.route");
const leadsRouter = require("./routes/leads.route");
const courseRouter = require("./routes/courses.route");

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// parse the cookies of the request
app.use(cookieParser());

// Adding middleware to parse the request body
app.use(express.json());

// to log requests
app.use(morgan("dev"));

// Creating routes
app.use("/api/v1/users", userRouter);
app.use("/api/v1/books", booksRouter);
app.use("/api/v1/leads", leadsRouter);
app.use("/api/v1/courses", courseRouter);

// Export the express app
module.exports = app;

// TODO: Ask about file handling.
