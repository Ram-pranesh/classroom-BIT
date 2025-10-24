import express from 'express';
import MentorStudent from '../models/mentorstudent.js';

const router = express.Router();

// Add student (email only)
router.post('/', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !email.endsWith('@bitsathy.ac.in')) {
      return res.status(400).json({ message: 'Invalid email' });
    }

    const existing = await MentorStudent.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'Student already exists' });
    }

    const student = new MentorStudent({ email });
    await student.save();

    res.status(201).json({ message: 'Student added', email });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get all students
router.get('/', async (req, res) => {
  try {
    const students = await MentorStudent.find({}, { _id: 0, email: 1 }); // return only email
    res.status(200).json(students);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch students' });
  }
});

// Delete student
router.delete('/:email', async (req, res) => {
  try {
    const { email } = req.params;
    await MentorStudent.deleteOne({ email });
    res.status(200).json({ message: 'Deleted student' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete', error: err.message });
  }
});

export default router;
