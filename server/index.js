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
app.use(cors({
    origin: "*",
    methods: ["POST", "GET", "PUT", "DELETE"],
    credentials: true
}));
app.use(cookieParser());
app.use("/imgs", express.static(path.join(__dirname, "imgs")));
app.use("/api", router);

app.get('/', (req, res) => {
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Smart Shop Server</title>
        </head>
        <body>
          <h1>Hello, this is the official server of GST Recovery Portal</h1>
          <p>Owner: Pranav</p>
        </body>
      </html>
    `;
  
    // Set the Content-Type header to indicate that the response is HTML
    res.setHeader('Content-Type', 'text/html');
  
    // Send the HTML content as the response body
    res.send(htmlContent);
  });

// Connecting to Database
connectDB();

// Starting the serveron Localhost
const PORT = process.env.PORT || 5000;
app.listen(PORT, (req, res) => {
  console.log(`Server running on Port ${PORT}`.yellow.bold);
});
