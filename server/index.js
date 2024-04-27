const express = require("express");
const dotenv = require("dotenv").config({ path: "./config.env" });
const app = express();
const colors = require("colors");
const cors = require("cors");
const path = require("path");
const router = require("./routes/router");
const cookieParser = require("cookie-parser");
const connectDB = require("./database/db");

// Initiall Set Up
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cors());
app.use(cookieParser());
app.use("/imgs", express.static(path.join(__dirname, "imgs")));
app.use("/api", router);

// Connecting to Database
connectDB();

// Starting the serveron Localhost
const PORT = process.env.PORT || 5000;
app.listen(PORT, (req, res) => {
  console.log(`Server running on Port ${PORT}`.yellow.bold);
});
