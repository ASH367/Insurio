const express = require("express");
const { v4: uuidv4 } = require("uuid");
const Session = require("../models/Session");

const router = express.Router();

router.post("/save", async (req, res) => {
  try {
    const { formData, messages } = req.body;
    const sessionId = uuidv4();

    const newSession = new Session({ sessionId, formData, messages });
    await newSession.save();

    res.status(201).json({ sessionId });
  } catch (err) {
    console.error("Save session error:", err.message);
    res.status(500).json({ error: "Failed to save session" });
  }
});

router.get("/:sessionId", async (req, res) => {
  try {
    const session = await Session.findOne({ sessionId: req.params.sessionId });
    if (!session) return res.status(404).json({ error: "Session not found" });

    res.json(session);
  } catch (err) {
    console.error("Fetch session error:", err.message);
    res.status(500).json({ error: "Failed to fetch session" });
  }
});

module.exports = router;
