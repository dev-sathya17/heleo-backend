const mongoose = require("mongoose");

const { MONGODB_URI, PORT } = require("./utils/config");
const app = require("./app");

// Connect to MongoDB
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB successfully");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => console.error("Error connecting to MongoDB:", error));
