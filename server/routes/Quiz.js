// import express from "express";
// import upload from "../middleware/Multer.js";
// import authMiddleware from "../middleware/Authmiddleware.js";
// import { createQuiz, deleteQuiz, downloadQuiz, getQuizzes, scheduleQuiz, startQuiz, submitQuiz } from "../controllers/Quiz.js";

// const QuizRoutes = express.Router();
// QuizRoutes.post('/quiz/create', upload.array('questionImage',10), createQuiz); // Use upload.array to handle multiple images dynamically
// QuizRoutes.get('/quiz/:id', getQuizzes);
// QuizRoutes.post('/quiz/start/:id', startQuiz);
// QuizRoutes.post('/quiz/schedule/:id', scheduleQuiz);
// QuizRoutes.post('/quiz/delete/:id', deleteQuiz);
// QuizRoutes.get('/quiz/download/:id', downloadQuiz);
// QuizRoutes.post('/quiz/submit/:id', authMiddleware, submitQuiz);
// export default QuizRoutes;

import express from "express";
import authMiddleware from "../middleware/Authmiddleware.js";
import { 
  createQuiz, 
  deleteQuiz, 
  downloadQuiz, 
  getQuizzes, 
  startQuiz, 
  endQuiz,
  submitQuiz, 
  setCurrentQuestion, 
  getQuizResults,
  joinQuiz
} from "../controllers/Quiz.js";

export default (upload) => {
  const router = express.Router();

  // Create a new quiz
  router.post('/quiz/create', upload.array('questionImage', 10), createQuiz);

  // Get all quizzes for a class (classId)
  router.get('/quiz/:id', getQuizzes);

  // Start a quiz (quizId), broadcasts to classId room
  router.post('/quiz/start/:id', startQuiz);

  // End a quiz (quizId), broadcasts to classId room
  router.post('/quiz/end/:id', endQuiz);

  // Delete a quiz (quizId)
  router.post('/quiz/delete/:id', deleteQuiz);

  // Download a quiz as PDF (quizId)
  router.get('/quiz/download/:id', downloadQuiz);

  // Submit an answer (quizId), requires authentication
  router.post('/quiz/submit/:id', authMiddleware, submitQuiz);

  // Set the current question (quizId), broadcasts to classId room
  router.post('/quiz/setQuestion/:id', setCurrentQuestion);

  // Get quiz results (quizId)
  router.get('/quiz/results/:id', getQuizResults);

  // Join a quiz (quizId), optional for tracking joined users
  router.post('/quiz/join/:id', authMiddleware, joinQuiz);

  return router;
};
