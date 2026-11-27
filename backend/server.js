// Load environment variables first
require("dotenv").config({
  path: __dirname + "/.env",
});

const express = require("express");
const cors = require("cors");

// Import configurations and routes
const connectDB = require("./config/db");
const ProductRoutes = require("./routes/ProductRoute");
const imageRoutes = require("./routes/imageRoutes");

// Initialize Express
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use("/api/products", ProductRoutes);
app.use("/api/images", imageRoutes);

// Home Route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Clothing Store API is running 🚀",
  });
});

// Server Port
const PORT = process.env.PORT || 5001;

// Start Server
const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Error starting server:", error.message);
    process.exit(1);
  }
};

startServer();