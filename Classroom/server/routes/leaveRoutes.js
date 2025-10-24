import express from 'express';
import Leave from '../models/leave.js';

const router = express.Router();

// POST /api/leave - Submit a new leave request
router.post('/', async (req, res) => {
  const { email, leaveType, fromDateTime, toDateTime, purpose } = req.body;

  if (!email || !leaveType || !fromDateTime || !toDateTime || !purpose) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const newLeave = new Leave({
      email,
      leaveType,
      fromDateTime,
      toDateTime,
      purpose,
      status: 'Pending', // optional default
    });

    await newLeave.save();
    res.status(201).json({ message: 'Leave request submitted successfully', leave: newLeave });
  } catch (error) {
    console.error('Error submitting leave:', error);
    res.status(500).json({ message: 'Failed to submit leave request' });
  }
});

// GET /api/leave?email=example@example.com - Fetch leaves by email
router.get('/', async (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ message: 'Email query parameter is required' });
  }

  try {
    const leaves = await Leave.find({ email }).sort({ createdAt: -1 });
    res.status(200).json(leaves);
  } catch (error) {
    console.error('Error fetching leaves:', error);
    res.status(500).json({ message: 'Failed to fetch leave data' });
  }
});

// DELETE /api/leave/:id - Delete leave by ID
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedLeave = await Leave.findByIdAndDelete(id);
    if (!deletedLeave) {
      return res.status(404).json({ message: 'Leave not found' });
    }

    res.status(200).json({ message: 'Leave deleted successfully' });
  } catch (error) {
    console.error('Error deleting leave:', error);
    res.status(500).json({ message: 'Failed to delete leave' });
  }
});









export default router;
