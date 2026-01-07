const express = require("express");
const app = express();
const PORT = 5000;

app.use(express.json());

// In-memory announcements
let announcements = [];

// Root
app.get("/", (req, res) => {
  res.send("🚀 HostelLife backend is running!");
});

// Get announcements
app.get("/api/announcements", (req, res) => {
  res.json(announcements);
});

// Post announcement
app.post("/api/announcements", (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ message: "Text is required" });
  }

  const announcement = {
    text,
    time: new Date().toLocaleString()
  };

  announcements.unshift(announcement);
  res.json(announcement);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});