const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./lib/mongodb");

const authRoutes = require("./routes/auth");
const profileRoutes = require("./routes/profile");
const problemRoutes = require("./routes/problems");

const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Middleware to ensure DB connection for each request
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error("Database connection error:", error);
    res.status(500).json({
      message: "Database connection failed",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Internal server error",
    });
  }
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/problems", problemRoutes);

// Health Check with DB test
app.get("/api/health", async (req, res) => {
  try {
    const mongoose = require("mongoose");
    const dbState = mongoose.connection.readyState;
    const states = ["disconnected", "connected", "connecting", "disconnecting"];

    res.json({
      message: "Driver App API is running!",
      database: states[dbState],
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || "development",
    });
  } catch (error) {
    res.status(500).json({
      message: "Health check failed",
      error: error.message,
    });
  }
});

// Global error handler
app.use((error, req, res, next) => {
  console.error("Global Error Handler:", {
    message: error.message,
    stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    url: req.url,
    method: req.method,
  });

  res.status(500).json({
    message: "Server error",
    error:
      process.env.NODE_ENV === "development"
        ? error.message
        : "Internal server error",
  });
});

// Handle 404
app.use("*", (req, res) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found` });
});

process.on("SIGINT", async () => {
  console.log("SIGINT received, shutting down gracefully");
  const mongoose = require("mongoose");
  await mongoose.connection.close();
  process.exit(0);
});

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
