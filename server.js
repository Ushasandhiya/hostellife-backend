console.log("MONGO_URI =", process.env.MONGO_URI);

console.log("🔥 THIS IS THE SERVER FILE THAT IS RUNNING");

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

/* ---------------- MIDDLEWARE ---------------- */
app.use(cors());
app.use(express.json());

/* ---------------- MONGODB CONNECT ---------------- */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });

/* ---------------- SCHEMA ---------------- */
const announcementSchema = new mongoose.Schema({
  text: String,
  time: String
});

const Announcement = mongoose.model(
  "Announcement",
  announcementSchema
);

/* ---------------- ROUTES ---------------- */

// Test route
app.get("/", (req, res) => {
  res.send("🚀 HostelLife backend is running!");
});

// GET announcements
app.get("/api/announcements", async (req, res) => {
  const announcements = await Announcement.find().sort({ _id: -1 });
  res.json(announcements);
});

// POST announcement
app.post("/api/announcements", async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ message: "Text is required" });
  }

  const newAnnouncement = new Announcement({
    text,
    time: new Date().toLocaleString()
  });

  await newAnnouncement.save();
  res.status(201).json(newAnnouncement);
});

/* ---------------- START SERVER ---------------- */
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});