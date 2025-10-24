import express from 'express';
import Achievement from '../models/Achievement.js';

const router = express.Router();

// POST /api/achievements
router.post('/', async (req, res) => {
  try {
    const { userEmail, ...rest } = req.body;
    console.log('Received update:', rest); // Add this line
    if (!userEmail) return res.status(400).json({ error: 'userEmail is required' });
    const filter = { _id: userEmail }; // Use _id as email
    const update = { $set: rest }; // Use $set to update only provided fields
    const options = { upsert: true, new: true, setDefaultsOnInsert: true };
    const achievement = await Achievement.findOneAndUpdate(filter, update, options);
    const latest = await Achievement.findById(userEmail);
    console.log('Saved in DB:', latest);
    res.status(200).json({ message: 'Achievement saved', achievement });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/achievements?userEmail=someone@example.com
router.get('/', async (req, res) => {
  
  try {
    const userEmail = req.query.userEmail; // <-- use userEmail
    if (!userEmail) {
      return res.status(400).json({ message: 'Missing userEmail' });
    }
    const achievement = await Achievement.findById(userEmail);
    if (!achievement) {
      return res.json({ achievement: {} });
    }
    res.json({ achievement });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/achievements/all
router.get('/all', async (req, res) => {
  try {
    const achievements = await Achievement.find({});
    res.json(achievements);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch achievements' });
  }
});

// DELETE achievement entry by section and index
router.delete('/:userEmail/:section/:index', async (req, res) => {
  const { userEmail, section, index } = req.params;
  try {
    const achievement = await Achievement.findById(userEmail);
    if (!achievement) {
      console.log('Achievement not found for', userEmail);
      return res.status(404).json({ error: 'Achievement not found' });
    }

    if (!Array.isArray(achievement[section])) {
      console.log('Section not found or not array:', section, achievement[section]);
      return res.status(400).json({ error: 'Section not found or not an array' });
    }

    console.log('Before splice:', achievement[section]);
    achievement[section].splice(Number(index), 1);
    console.log('After splice:', achievement[section]);
    await achievement.save();
    console.log('Saved achievement');
    res.json({ success: true });
  } catch (err) {
    console.error('Error in DELETE:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;