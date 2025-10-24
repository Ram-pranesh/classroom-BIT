// import express from 'express';
// import Leave from '../models/leave.js';

// const router = express.Router();

// // GET all leave requests (ignore email query completely)
// router.get('/', async (req, res) => {
//   try {
//     const leaves = await Leave.find().sort({ createdAt: -1 }); // Most recent first
//     res.json(leaves);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching leave data' });
//   }
// });

// // PATCH to update leave status (approve or decline)
// router.patch('/:id', async (req, res) => {
//   const { id } = req.params;
//   const { status } = req.body;

//   if (!['Approved', 'Declined'].includes(status)) {
//     return res.status(400).json({ message: 'Invalid status value' });
//   }

//   try {
//     const updatedLeave = await Leave.findByIdAndUpdate(
//       id,
//       { status },
//       { new: true }
//     );

//     if (!updatedLeave) {
//       return res.status(404).json({ message: 'Leave request not found' });
//     }

//     res.json(updatedLeave);
//   } catch (error) {
//     res.status(500).json({ message: 'Error updating leave status' });
//   }
// });

// export default router;


import express from 'express';
import Leave from '../models/leave.js';
import MentorStudent from '../models/mentorStudent.js'; // Importing MentorStudent model

const router = express.Router();

// GET only leave requests for emails in mentorstudents collection
router.get('/', async (req, res) => {
  try {
    // Step 1: Get all mentor student emails
    const mentorStudents = await MentorStudent.find({}, 'email');
    const mentorEmails = mentorStudents.map(student => student.email);

    // Step 2: Find leaves where email is in mentorEmails
    const leaves = await Leave.find({ email: { $in: mentorEmails } })
                              .sort({ createdAt: -1 });

    res.json(leaves);
  } catch (error) {
    console.error('Error fetching filtered leave data:', error);
    res.status(500).json({ message: 'Error fetching leave data' });
  }
});

// PATCH to update leave status (approve or decline)
router.patch('/:id', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!['Approved', 'Declined'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status value' });
  }

  try {
    const updatedLeave = await Leave.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedLeave) {
      return res.status(404).json({ message: 'Leave request not found' });
    }

    res.json(updatedLeave);
  } catch (error) {
    console.error('Error updating leave status:', error);
    res.status(500).json({ message: 'Error updating leave status' });
  }
});

export default router;
