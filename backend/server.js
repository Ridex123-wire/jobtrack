/* global require, process */
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const Application = require("./models/Application");
const authRoutes = require("./routes/auth");
const protect = require("./middleware/authMiddleware");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Authentication routes
app.use("/api/auth", authRoutes);

// Home route
app.get("/", (req, res) => {
  res.send("JobTrack backend is running!");
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "JobTrack API is working!",
  });
});

// Get applications belonging to the logged-in user
app.get("/api/applications", protect, async (req, res) => {
  try {
    const applications = await Application.find({
      user: req.userId,
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      applications,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Add a new application
app.post("/api/applications", protect, async (req, res) => {
  try {
    const { company, role, date, status, interviewDate } = req.body;

    const newApplication = new Application({
      company,
      role,
      date,
      status,
      interviewDate: interviewDate || "",
      user: req.userId,
    });

    const savedApplication = await newApplication.save();

    res.status(201).json({
      success: true,
      message: "Application added successfully!",
      application: savedApplication,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

// Update an application belonging to the logged-in user
app.put("/api/applications/:id", protect, async (req, res) => {
  try {
    const { company, role, date, status, interviewDate } = req.body;

    const updatedApplication = await Application.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.userId,
      },
      {
        company,
        role,
        date,
        status,
        interviewDate: interviewDate || "",
      },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!updatedApplication) {
      return res.status(404).json({
        success: false,
        message: "Application not found.",
      });
    }

    res.json({
      success: true,
      message: "Application updated successfully!",
      application: updatedApplication,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

// Delete an application belonging to the logged-in user
app.delete("/api/applications/:id", protect, async (req, res) => {
  try {
    const deletedApplication = await Application.findOneAndDelete({
      _id: req.params.id,
      user: req.userId,
    });

    if (!deletedApplication) {
      return res.status(404).json({
        success: false,
        message: "Application not found.",
      });
    }

    res.json({
      success: true,
      message: "Application deleted successfully!",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

// Connect to MongoDB and start the server
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected successfully!");

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`JobTrack server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);
  });
