import express from "express";
import Achievement from "../models/Achievement.js";
import User from "../models/user.js"; // Make sure you have this model

const router = express.Router();

// GET achievement by user email
router.get("/", async (req, res) => {
  try {
    const userEmail = req.query.userEmail; // <-- use userEmail
    if (!userEmail) {
      return res.status(400).json({ message: "Missing userEmail" });
    }
    const achievement = await Achievement.findById(userEmail);
    if (!achievement) {
      return res.status(404).json({ message: "Achievement not found" });
    }
    res.json({ achievement });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST achievement by user email
router.post("/", async (req, res) => {
  try {
    const { userEmail, ...achievementData } = req.body; // <-- use userEmail
    if (!userEmail) {
      return res.status(400).json({ message: "Missing userEmail" });
    }
    // Upsert achievement by _id (which is email)
    const achievement = await Achievement.findByIdAndUpdate(
      userEmail,
      { _id: userEmail, ...achievementData },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    res.json({ achievement });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;