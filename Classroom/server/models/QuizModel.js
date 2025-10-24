import mongoose from "mongoose";

const quizSchema = new mongoose.Schema({
  title: { type: String, required: true },
  classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
  questions: [{
    image: { type: String },
    text: { type: String, required: true },
    options: [{ text: { type: String, required: true }, isCorrect: { type: Boolean, required: true } }],
    marks: { type: Number, required: true },
    timeLimit: { type: Number, default: 0 }
  }],
  totalMarks: { type: Number },
  started: { type: Boolean, default: false },
  completed: { type: Boolean, default: false },
  currentQuestionIndex: { type: Number, default: 0 },
  showResults: { type: Boolean, default: false },
  submitEnabled: { type: Boolean, default: true },
  joinedUsers: [{ type: String }],
  submissions: [{
    user: { type: String },
    answers: [{ type: String }]
  }],
  responseStats: {
    attendedCount: { type: Number, default: 0 },
    notAttendedCount: { type: Number, default: 0 },
    notAttendedStudents: [{ type: String }]
  }
}, { timestamps: true });

const QuizModel = mongoose.model('Quiz', quizSchema);
export default QuizModel;