import mongoose from 'mongoose';

const mentorStudentSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true
  }
});

// Fix: Only create model if it doesn't exist
const MentorStudent = mongoose.models.MentorStudent || mongoose.model('MentorStudent', mentorStudentSchema);

export default MentorStudent;
