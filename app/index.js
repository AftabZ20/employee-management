const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require("body-parser");

// Load environment variables
dotenv.config();

// Express app setup
const app = express();

// APP SETUP
const PORT = process.env.PORT || 8000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    dbName: "EmployeeManagement",
  })
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Default Route
app.get("/", (req, res) => {
  res.send("Organization Management System API is running.");
});

//Modular Routes
app.use("/api/v1/user", require("./user_management/user.routes"));

//Exposing the Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
