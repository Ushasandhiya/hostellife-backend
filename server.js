require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

/* ---------- MIDDLEWARE ---------- */
app.use(cors());
app.use(express.json());

/* ---------- DB CONNECT ---------- */
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ Mongo error", err));

/* ---------- SCHEMAS ---------- */
const announcementSchema = new mongoose.Schema({
  text: String,
  time: String
});
const Announcement = mongoose.model("Announcement", announcementSchema);

const ratingSchema = new mongoose.Schema({
  rating: { type: Number, min: 1, max: 5 },
  date: String
});
const Rating = mongoose.model("Rating", ratingSchema);

/* ---------- ROUTES ---------- */

// test
app.get("/", (req, res) => {
  res.send("🚀 HostelLife backend running");
});

// announcements
app.get("/api/announcements", async (req, res) => {
  const data = await Announcement.find().sort({ _id: -1 });
  res.json(data);
});

app.post("/api/announcements", async (req, res) => {
  const a = new Announcement({
    text: req.body.text,
    time: new Date().toLocaleString()
  });
  await a.save();
  res.status(201).json(a);
});

// ⭐ RATINGS
app.post("/api/ratings", async (req, res) => {
  const { rating, date } = req.body;
  if (!rating || !date) return res.status(400).json({ msg: "Missing data" });

  const exists = await Rating.findOne({ date });
  if (exists) return res.status(409).json({ msg: "Already rated" });

  const r = new Rating({ rating, date });
  await r.save();
  res.status(201).json(r);
});

app.get("/api/ratings/stats", async (req, res) => {
  const all = await Rating.find();
  if (!all.length) return res.json({ avg: 0, count: 0 });

  const avg = all.reduce((a, b) => a + b.rating, 0) / all.length;
  res.json({ avg: avg.toFixed(1), count: all.length });
});

/* ---------- START SERVER LAST ---------- */
app.listen(PORT, () => {
  console.log(`🔥 Server running on http://localhost:${PORT}`);
});
// DELETE announcement
app.delete("/api/announcements/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await Announcement.findByIdAndDelete(id);

    res.json({ message: "Announcement deleted" });
  } catch (err) {
    res.status(500).json({ error: "Delete failed" });
  }
});