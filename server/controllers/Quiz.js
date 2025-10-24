import QuizModel from "../models/QuizModel.js";
import ClassModel from "../models/Class.js";
import StudentsModel from "../models/students.js";
import path from "path";
import fs from "fs";
import PDFDocument from "pdfkit";

const createQuiz = async (req, res) => {
  try {
    const { title, classId, questions } = req.body;

    if (!title || !classId || !questions) {
      return res.status(400).json({ success: false, message: "Title, classId, and questions are required" });
    }

    let parsedQuestions;
    try {
      parsedQuestions = typeof questions === 'string' ? JSON.parse(questions) : questions;
    } catch (error) {
      console.error('Error parsing questions:', error);
      return res.status(400).json({ success: false, message: "Invalid questions format", error: error.message });
    }

    if (!Array.isArray(parsedQuestions) || parsedQuestions.length === 0) {
      return res.status(400).json({ success: false, message: "Questions must be a non-empty array" });
    }

    const classData = await ClassModel.findById(classId);
    if (!classData) {
      return res.status(404).json({ success: false, message: "Class not found" });
    }

    const processedQuestions = parsedQuestions.map((q, index) => {
      if (!q.text || typeof q.text !== 'string' || q.text.trim() === '') {
        throw new Error(`Question ${index + 1} is missing a valid text field`);
      }
      if (!Array.isArray(q.options) || q.options.length < 2) {
        throw new Error(`Question ${index + 1} must have at least two options`);
      }

      let imageFile = null;
      if (req.files && Array.isArray(req.files)) {
        const image = req.files.find(file => file.originalname === `questionImage${index}`);
        if (image) {
          imageFile = image.filename;
        }
      }

      return {
        text: q.text,
        options: q.options.map(opt => ({
          text: opt.text,
          isCorrect: opt.isCorrect === 'true' || opt.isCorrect === true
        })),
        marks: parseInt(q.marks) || 1,
        image: imageFile,
        timeLimit: 0
      };
    });

    const totalMarks = processedQuestions.reduce((sum, q) => sum + (q.marks || 0), 0);

    const quiz = new QuizModel({
      title,
      classId,
      questions: processedQuestions,
      totalMarks,
      allStudents: classData.students || []
    });

    await quiz.save();

    if (!Array.isArray(classData.quizzes)) {
      classData.quizzes = [];
    }
    classData.quizzes.push(quiz._id);
    await classData.save();

    res.status(201).json({ success: true, message: "Quiz created successfully", quiz });
  } catch (error) {
    console.error('Error in createQuiz:', error.stack);
    res.status(500).json({ success: false, message: "Internal server error", error: error.message });
  }
};

const getQuizzes = async (req, res) => {
  try {
    const { id } = req.params;
    const quizzes = await QuizModel.find({ classId: id });
    const students = await StudentsModel.find({ ClassId: id });
    const totalStudents = students.length;
    const quizStats = quizzes.map(quiz => ({
      ...quiz._doc,
      totalStudents,
      attended: quiz.submissions.length,
      notAttended: totalStudents - quiz.submissions.length,
      joinedUsers: quiz.joinedUsers,
      allStudents: students.map(s => s.email)
    }));
    res.status(200).json({ success: true, quizzes: quizStats });
  } catch (error) {
    console.error('Error in getQuizzes:', error.stack);
    res.status(500).json({ success: false, message: "Internal server error", error: error.message });
  }
};

const startQuiz = async (req, res) => {
  try {
    const { id } = req.params; // quizId
    const quiz = await QuizModel.findById(id);
    if (!quiz) return res.status(404).json({ success: false, message: "Quiz not found" });
    
    if (quiz.completed || quiz.submissions.length > 0) {
      quiz.submissions = [];
      quiz.attemptedBy = [];
      quiz.joinedUsers = [];
      quiz.completed = false;
    }
    quiz.started = true;
    quiz.currentQuestionIndex = 0;
    await quiz.save();

    req.io.to(quiz.classId.toString()).emit('quizStarted', { quizId: id, classId: quiz.classId.toString() });
    console.log('Backend emitted quizStarted:', { quizId: id, classId: quiz.classId.toString() });

    res.status(200).json({ success: true, message: quiz.completed || quiz.submissions.length > 0 ? "Quiz restarted" : "Quiz started" });
  } catch (error) {
    console.error('Error in startQuiz:', error.stack);
    res.status(500).json({ success: false, message: "Internal server error", error: error.message });
  }
};

const endQuiz = async (req, res) => {
  try {
    const { id } = req.params;
    const quiz = await QuizModel.findById(id);
    if (!quiz) return res.status(404).json({ success: false, message: "Quiz not found" });

    quiz.completed = true;
    const submissions = Array.isArray(quiz.submissions) ? quiz.submissions : [];
    const allStudents = Array.isArray(quiz.allStudents) ? quiz.allStudents : [];
    const attendedCount = submissions.length;
    const totalStudents = allStudents.length;
    const notAttendedCount = totalStudents - attendedCount;
    const notAttendedStudents = allStudents.filter(student => !submissions.some(sub => sub.user === student));

    quiz.responseStats = {
      attendedCount,
      notAttendedCount,
      notAttendedStudents
    };
    await quiz.save();

    req.io.to(quiz.classId.toString()).emit('quizEnded', { quizId: id, classId: quiz.classId.toString() });
    res.status(200).json({ success: true, message: "Quiz ended" });
  } catch (error) {
    console.error('Error in endQuiz:', error.stack);
    res.status(500).json({ success: false, message: "Internal server error", error: error.message });
  }
};

const deleteQuiz = async (req, res) => {
  try {
    const { id } = req.params;
    await QuizModel.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Quiz deleted" });
  } catch (error) {
    console.error('Error in deleteQuiz:', error.stack);
    res.status(500).json({ success: false, message: "Internal server error", error: error.message });
  }
};

const downloadQuiz = async (req, res) => {
  try {
    const { id } = req.params;
    const quiz = await QuizModel.findById(id);
    if (!quiz) return res.status(404).json({ success: false, message: "Quiz not found" });

    const doc = new PDFDocument();
    const fileName = `${quiz.title.replace(/\s+/g, '_')}_${Date.now()}.pdf`;
    const filePath = path.join(path.resolve(), "public", "quizzes", fileName);
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    doc.fontSize(20).text(quiz.title, { align: 'center' });
    quiz.questions.forEach((q, i) => {
      doc.moveDown();
      doc.fontSize(14).text(`Q${i + 1}: ${q.text} (${q.marks} marks)`);
      if (q.image) {
        const imagePath = path.join(path.resolve(), "public", "images", q.image);
        if (fs.existsSync(imagePath)) doc.image(imagePath, { width: 200 });
        else doc.text("(Image not found)");
      }
      q.options.forEach((opt, j) => doc.fontSize(12).text(`${j + 1}. ${opt.text} ${opt.isCorrect ? '(Correct)' : ''}`));
    });
    doc.end();

    stream.on('finish', () => {
      res.download(filePath, fileName, (err) => {
        if (err) res.status(500).json({ success: false, message: "Error downloading file" });
        fs.unlink(filePath, (unlinkErr) => { if (unlinkErr) console.error("Error deleting file:", unlinkErr); });
      });
    });
  } catch (error) {
    console.error("Download error:", error);
    res.status(500).json({ success: false, message: "Error generating quiz PDF" });
  }
};

const submitQuiz = async (req, res) => {
  try {
    const { id } = req.params;
    const { questionIndex, answer } = req.body;
    const quiz = await QuizModel.findById(id);
    if (!quiz) return res.status(404).json({ success: false, message: "Quiz not found" });

    if (!quiz.questions.every(q => q.text && typeof q.text === 'string')) {
      return res.status(400).json({ success: false, message: "Quiz contains invalid questions missing text" });
    }

    const userEmail = req.user.email;
    const submission = quiz.submissions.find(sub => sub.user === userEmail) || { user: userEmail, answers: [] };
    if (!submission.answers[questionIndex]) { // Prevent resubmission
      submission.answers[questionIndex] = answer;
      if (!quiz.submissions.some(sub => sub.user === userEmail)) {
        quiz.submissions.push(submission);
      }
      await quiz.save();
      req.io.to(quiz.classId.toString()).emit('updateResults', { questionIndex, submissions: quiz.submissions });
    }
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error in submitQuiz:', error.stack);
    res.status(500).json({ success: false, message: "Internal server error", error: error.message });
  }
};

const setCurrentQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const { questionIndex, showResults, timeLimit, submitEnabled } = req.body;
    const quiz = await QuizModel.findById(id);
    if (!quiz) return res.status(404).json({ success: false, message: "Quiz not found" });

    quiz.currentQuestionIndex = questionIndex;
    quiz.showResults = showResults !== undefined ? showResults : false;
    quiz.submitEnabled = submitEnabled !== undefined ? submitEnabled : false;
    if (timeLimit !== undefined && questionIndex >= 0) {
      quiz.questions[questionIndex].timeLimit = timeLimit;
    }
    await quiz.save();

    req.io.to(quiz.classId.toString()).emit('updateQuestion', { 
      quizId: id,
      questionIndex, 
      question: questionIndex >= 0 ? quiz.questions[questionIndex] : null, 
      showResults: quiz.showResults, 
      timeLimit: questionIndex >= 0 ? quiz.questions[questionIndex].timeLimit : 0,
      submitEnabled: quiz.submitEnabled,
      classId: quiz.classId.toString()
    });
    res.status(200).json({ success: true, message: "Question updated" });
  } catch (error) {
    console.error('Error in setCurrentQuestion:', error.stack);
    res.status(500).json({ success: false, message: "Internal server error", error: error.message });
  }
};

const getQuizResults = async (req, res) => {
  try {
    const { id } = req.params;
    const quiz = await QuizModel.findById(id);
    if (!quiz) return res.status(404).json({ success: false, message: "Quiz not found" });

    res.status(200).json({ success: true, submissions: quiz.submissions });
  } catch (error) {
    console.error('Error in getQuizResults:', error.stack);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const joinQuiz = async (req, res) => {
  try {
    const { id } = req.params;
    const userEmail = req.user.email;
    const quiz = await QuizModel.findById(id);
    if (!quiz) return res.status(404).json({ success: false, message: "Quiz not found" });

    if (!quiz.joinedUsers.includes(userEmail)) {
      quiz.joinedUsers.push(userEmail);
      await quiz.save();
      req.io.to(quiz.classId.toString()).emit('userJoined', { userEmail, joinedUsers: quiz.joinedUsers });
      // Send current question to the classroom room
      req.io.to(quiz.classId.toString()).emit('updateQuestion', {
        quizId: id,
        questionIndex: quiz.currentQuestionIndex,
        question: quiz.questions[quiz.currentQuestionIndex],
        showResults: quiz.showResults,
        timeLimit: quiz.questions[quiz.currentQuestionIndex].timeLimit,
        submitEnabled: quiz.submitEnabled,
        classId: quiz.classId.toString()
      });
    }
    res.status(200).json({ success: true, message: "Joined quiz" });
  } catch (error) {
    console.error('Error in joinQuiz:', error.stack);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export { 
  createQuiz,
  getQuizzes,
  startQuiz,
  endQuiz,
  deleteQuiz,
  downloadQuiz,
  submitQuiz,
  setCurrentQuestion,
  getQuizResults,
  joinQuiz
};