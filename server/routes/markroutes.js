import express from 'express';
import Marks from '../models/mark.js';

const router = express.Router();

// GET /api/marks?semester=1&marktype=Internal
router.get('/', async (req, res) => {
  try {
    const { semester, marktype } = req.query;

    // Validate query params
    if (!semester || !marktype) {
      return res
        .status(400)
        .json({ message: 'Semester and marktype are required' });
    }

    const sem = parseInt(semester, 10);
    if (isNaN(sem)) {
      return res
        .status(400)
        .json({ message: 'Semester must be a valid number' });
    }

    // Fetch marks from DB
    const marks = await Marks.find({
      semester: sem,
      marktype: { $regex: `^${marktype.trim()}$`, $options: 'i' }, // case-insensitive
    });
    console.log('Fetched marks:', marks);
    res.json(marks);
  } catch (error) {
    console.error('Error fetching marks:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
