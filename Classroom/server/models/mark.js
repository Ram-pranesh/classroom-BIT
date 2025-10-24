import mongoose from 'mongoose';

const markSchema = new mongoose.Schema({
  loginId: {
    type: String,
    required: true,
  },
  semester: {
    type: Number,
    required: true,
  },
  marktype: {
    type: String,
    required: true,
  },
  type2: String,
  subject: {
    type: String,
    required: true,
  },
  Mark: {
    type: Number,
    required: true,
  },
  Percentage: {
    type: Number,
    required: true,
  },
}, { timestamps: true });

const Mark = mongoose.model('Mark', markSchema,'marks');
export default Mark;

