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

export const filterAchievements = async (req, res) => {
  try {
    const { emails, category } = req.body;

    if (!emails || !Array.isArray(emails) || emails.length === 0) {
      return res.status(400).json({ message: 'Valid email array is required' });
    }

    if (!category) {
      return res.status(400).json({ message: 'Category is required' });
    }

    const categoryMap = {
      'Paper Presentations': 'paperpresentations',
      'Publications': 'publications',
      'Patents': 'patents',
      'Entrepreneurship': 'entrepreneurship',
      'Placement': 'placement',
      'Project Details': 'projectdetails',
      'Competitions': 'competitions',
      'Internship': 'internship',
      'Online Course': 'onlinecourse',
      'Product Development': 'productdevelopment'
    };

    const categoryKey = categoryMap[category];
    
    if (!categoryKey) {
      return res.status(400).json({ message: 'Invalid category' });
    }

    const achievements = await Achievement.find({
      userEmail: { $in: emails }
    });

    const results = achievements
      .filter(achievement => {
        const categoryData = achievement.achievement?.[categoryKey];
        return categoryData && Array.isArray(categoryData) && categoryData.length > 0;
      })
      .map(achievement => ({
        studentName: achievement.achievement.personalDetails?.name || achievement.userEmail,
        studentEmail: achievement.userEmail,
        achievements: {
          [categoryKey]: achievement.achievement[categoryKey]
        }
      }));

    res.status(200).json({
      success: true,
      count: results.length,
      results
    });

  } catch (error) {
    console.error('Error filtering achievements:', error);
    res.status(500).json({ message: 'Server error while filtering achievements' });
  }
};

export default router;