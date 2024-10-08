// Importing bcrypt library for encrypting passwords
const bcrypt = require("bcrypt");

// Importing the User model
const User = require("../models/user");

// Importing the jwt library
const jwt = require("jsonwebtoken");

// Importing the EMAIL_ID from the configuration file
const { SECRET_KEY } = require("../utils/config");

// Importing the generateOtp function from the userHelper
const generateOtp = require("../helpers/userHelper");

const userController = {
  // TODO: Email
  // API for registering users
  register: async (req, res) => {
    try {
      // Destructuring the request body
      const { firstName, lastName, email, password, mobile } = req.body;

      // Checking if user already exists
      const existingUser = await User.findOne({ email });

      if (existingUser) {
        return res.json({ message: "User with this email already exists" });
      }

      // Checking if mobile number already exists
      const existingMobile = await User.findOne({ mobile });

      if (existingMobile) {
        return res.json({ message: "Mobile number must be unique" });
      }

      // Encrypting the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Creating a new user
      const user = new User({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        mobile,
      });

      // Saving the user to the database
      await user.save();

      // Sending a success response
      res.status(201).json({
        message: "Your account has been created successfully.",
        user,
      });
    } catch (error) {
      // Sending an error response
      res.status(500).json({ message: error.message });
    }
  },

  // API for user login
  login: async (req, res) => {
    try {
      // getting the user email and password from the request body
      const { username, password } = req.body;

      // checking if the user exists in the database
      const user = await User.findOne({
        $or: [{ email: username }, { mobile: username }],
      });

      // if the user does not exist, return an error response
      if (!user) {
        return res.status(404).send({ message: "User not found" });
      }

      // if the user exists check the password
      const isPasswordValid = await bcrypt.compare(password, user.password);

      // if the password is invalid, return an error response
      if (!isPasswordValid) {
        return res.status(400).send({ message: "Invalid password" });
      }

      // generating a JWT token
      const token = jwt.sign({ id: user._id }, SECRET_KEY);

      // setting the token as a cookie
      res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        expires: new Date(Date.now() + 24 * 3600000), // 24 hours from login
        path: "/",
      });

      // Setting user role as cookie
      // res.cookie("role", user.role, {
      //   httpOnly: true,
      //   secure: true,
      //   sameSite: "none",
      //   expires: new Date(Date.now() + 24 * 3600000), // 24 hours from login
      //   path: "/",
      // });

      // sending a success response
      res.status(200).json({
        message: "Login successful",
        user,
      });
    } catch (error) {
      // sending an error response
      res.status(500).send({ message: error.message });
    }
  },

  // API for user logout
  logout: async (req, res) => {
    try {
      const userId = req.userId;

      if (!userId) {
        return res.status(400).send({ message: "User not authenticated" });
      }

      // clearing the cookie
      res.clearCookie("token", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: "/",
      });
      res.clearCookie("role", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: "/",
      });

      // sending a success response
      res.status(200).send({ message: "Logged out successfully" });
    } catch (error) {
      // Sending an error response
      res.status(500).send({ message: error.message });
    }
  },

  // API for sending email for the user when user wants to reset password
  forgotPassword: async (req, res) => {
    try {
      // Extracting values from request body
      const { email } = req.body;

      // Checking if this email is of a valid user
      const user = await User.findOne({ email });
      if (!user) {
        return res
          .status(404)
          .json({ message: "User with this email does not exist" });
      }

      // Generating otp
      const otp = generateOtp();

      // Update user
      user.otp = otp;
      await user.save();

      const subject = "Password Reset Request";
      const message = `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Reset Your Taskify Password</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            background-color: #f9f9f9;
                            margin: 0;
                            padding: 20px;
                        }
                        .container {
                            max-width: 600px;
                            background-color: #ffffff;
                            padding: 30px;
                            border-radius: 10px;
                            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                            margin: auto;
                        }
                        h1 {
                            color: #333333;
                            font-size: 24px;
                        }
                        p {
                            font-size: 16px;
                            line-height: 1.6;
                            color: #555555;
                        }
                        .otp {
                            font-size: 24px;
                            font-weight: bold;
                            color: #28a745;
                            letter-spacing: 2px;
                            margin: 20px 0;
                            padding: 10px 20px;
                            border: 1px dashed #28a745;
                            display: inline-block;
                            background-color: #f0f9f4;
                            border-radius: 5px;
                        }
                        
                    </style>
                </head>
                <body>
                    <div class="container">
                        <h1>Password Reset Request</h1>
                        <p>Hi ${user.name},</p>
                        <p>You recently requested to reset your password for your Taskify account. Use the following OTP (One Time Password) to reset your password:</p>
                        <div class="otp">${otp}</div>
                        <p>This OTP is valid for the next 10 minutes. If you did not request a password reset, please ignore this email or contact support if you have any concerns.</p>
                        <p>Thank you,<br>The Taskify Team</p>
                    </div>
                </body>
                </html>
                `;

      // Sending an email
      sendEmail(email, subject, message);

      // Sending a success response
      res.status(200).json({
        message: "OTP successfully sent to your email address.",
      });
    } catch (error) {
      // Sending an error response
      res.status(500).json({ message: error.message });
    }
  },

  // API to verify OTP
  verifyOtp: async (req, res) => {
    try {
      const { otp, email } = req.body;

      const user = await User.findOne({ email });

      if (!user) {
        return res
          .status(404)
          .send({ message: "user not found with this email id" });
      }

      if (user.otp === otp) {
        user.otp = 0;
        await user.save();
        res.status(200).send({ message: "OTP verified successfully" });
      } else {
        return res.status(400).send({ message: "Invalid OTP" });
      }
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  },

  // API for resetting password
  resetPassword: async (req, res) => {
    try {
      // Extracting values from request body
      const { email, password } = req.body;

      // Checking if this email is of a valid user
      const user = await User.findOne({ email });
      if (!user) {
        return res
          .status(404)
          .json({ message: "User with this email does not exist" });
      }

      // Encrypting the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Update user
      user.password = hashedPassword;
      await user.save();

      // Sending a success response
      res.status(200).json({ message: "Password reset successfully" });
    } catch (error) {
      // Sending an error response
      res.status(500).json({ message: error.message });
    }
  },

  // API to get user profile information
  getProfile: async (req, res) => {
    try {
      // Getting user id from request parameters
      const id = req.userId;

      // Fetching the user from the database
      const user = await User.findById(id, "-password -otp -__v");

      // If user not found, return error response
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // If user found, return the user data
      res.json(user);
    } catch (error) {
      // Sending an error response
      res.status(500).json({ message: error.message });
    }
  },

  // API to update user profile information
  updateProfile: async (req, res) => {
    try {
      // Getting user id from request parameters
      const { id } = req.params;
      const { firstName, lastName, email, mobile } = req.body;

      const user = await User.findById(id);

      // If user not found, return error response
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Updating user profile information
      user.firstName = firstName || user.firstName;
      user.lastName = lastName || user.lastName;
      user.email = email || user.email;
      user.mobile = mobile || user.mobile;
      // user.image = req.file ? req.file.path : user.image;

      // Saving info to the database
      const updatedUser = await user.save();

      // If user found, return the updated user data
      res.json({ message: "User profile updated successfully", updatedUser });
    } catch (error) {
      // Sending an error response
      res.status(500).json({ message: error.message });
    }
  },

  // API to delete user
  deleteProfile: async (req, res) => {
    try {
      // Getting user id from request parameters
      const { id } = req.params;

      // Finding and deleting the user from the database using the id in the request parameters.
      const user = await User.findByIdAndDelete(id);

      // If user not found, return error response
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const currentUser = User.findById(req.userId);

      if (currentUser.role !== "admin") {
        // Removing the user cookie
        res.clearCookie("token");
        res.clearCookie("role");
      }

      // returning success response, if user is deleted
      res.json({ message: "User deleted successfully" });
    } catch (error) {
      // Sending an error response
      res.status(500).json({ message: error.message });
    }
  },

  // API to check authentication
  checkAuthentication: async (req, res) => {
    try {
      const token = req.cookies.token;
      const role = req.cookies.role;

      // If token does not exist
      if (!token) {
        return res.status(401).json({ message: "Access Denied" });
      }

      // Verifying the token using JWT
      try {
        const verified = jwt.verify(token, SECRET_KEY);
        res.status(200).json({ message: "Authentication successful", role });
      } catch (error) {
        // Sending an error response
        return res.status(401).json({ message: "Invalid token" });
      }
    } catch (error) {
      // Sending an error response
      res.status(500).json({ message: error.message });
    }
  },

  getUsers: async (req, res) => {
    try {
      const users = await User.find({
        // where: {
        //   role: "user",
        // },
      });
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = userController;
