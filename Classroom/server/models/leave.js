import mongoose from 'mongoose';

const leaveSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true, // Required so leave is always linked to a user
  },
  leaveType: {
    type: String,
    required: true,
    enum: ['Casual Leave', 'Sick Leave', 'Earned Leave'],
  },
  fromDateTime: {
    type: Date,
    required: true,
  },
  toDateTime: {
    type: Date,
    required: true,
  },
  purpose: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Declined'],
    default: 'Pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Leave = mongoose.model('Leave', leaveSchema);
export default Leave;
