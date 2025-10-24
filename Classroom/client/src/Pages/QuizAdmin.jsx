import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';
import SecondNav from '../Components/SecondNav';
import { classGet, classPost, downloadFile } from '../services/Endpoint';
import toast from 'react-hot-toast';
import { FaTrash } from 'react-icons/fa';

// const socket = io('http://localhost:8000', {
//   transports: ['websocket', 'polling'],
//   reconnection: true,
//   reconnectionAttempts: 5,
//   reconnectionDelay: 1000,
// });

const styles = `
  /* Page Background */
  .page-container {
    background-color: #d3d8e0;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    position: relative;
  }

  /* Card Container for all content */
  .card-container {
    background-color: #fff;
    border-radius: 1rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 700px;
    padding: 0 2rem 2rem 2rem;
    margin-top: 1rem;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  /* Style for SecondNav to merge with the top of the card */
  .second-nav {
    background-color: #fff;
    border-top-left-radius: 1rem;
    border-top-right-radius: 1rem;
    padding: 0rem 0;
    margin: 0 -2rem;
  }

  /* Headings */
  .class-name {
    font-size: 2.5rem;
    font-weight: 800;
    color: #6b48ff;
    margin-bottom: 0.2rem;
    text-align: center;
  }

  /* Responsive adjustments */
  @media (max-width: 768px) {
    .page-container {
      padding: 10px;
    }
    .card-container {
      padding: 0 1rem 1rem 1rem;
      margin-top: 0.5rem;
    }
    .second-nav {
      margin: 0 -1rem;
      padding: 0.75rem 0;
    }
    .class-name {
      font-size: 1.8rem;
    }
  }

  /* Backdrop for blur effect */
  .backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(5px);
    z-index: 999;
  }

  @layer components {
    .quiz-card {
      width: 800px;
      height: 600px;
      background-color: #fff;
      border-radius: 20px;
      padding: 20px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-family: sans-serif;
      z-index: 1000;
    }
    .quiz-card__close {
      position: absolute;
      top: 10px;
      right: 10px;
      background: none;
      border: 2px solid #333;
      border-radius: 50%;
      width: 30px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      cursor: pointer;
      color: #333;
    }
    .quiz-card__close:hover {
      background-color: #e0e0e0;
    }
    .quiz-card__title {
      text-align: center;
      font-size: 28px;
      font-weight: bold;
      color: #333;
      margin-bottom: 20px;
    }
    .quiz-card__content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex: 1;
      padding: 0 20px;
    }
    .quiz-card__image {
      width: 48%;
      height: 200px;
      border: 1px solid #ccc;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #e0e0e0;
    }
    .quiz-card__image img {
      width: 100%;
      height: 100%;
      border-radius: 10px;
      object-fit: cover;
    }
    .quiz-card__poll {
      width: 48%;
      display: flex;
      justify-content: center;
      align-items: flex-end;
      height: 100%;
      padding-bottom: 30px;
    }
    .quiz-card__poll-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      position: relative;
      width: 20%;
      margin: 0 20px;
    }
    .quiz-card__poll-item--correct {
      position: absolute;
      top: -20px;
      font-size: 16px;
      color: #28a745;
    }
    .quiz-card__poll-votes {
      font-size: 18px;
      font-weight: bold;
      color: #333;
      margin-bottom: 10px;
    }
    .quiz-card__poll-bar {
      width: 60px;
      background-color: #4a90e2;
      border-top-left-radius: 10px;
      border-top-right-radius: 10px;
      position: relative;
      min-height: 20px;
      transition: height 0.3s ease;
    }
    .quiz-card__poll-label {
      font-size: 14px;
      font-weight: 500;
      color: #333;
      text-align: center;
      margin-top: 10px;
      white-space: nowrap;
    }
    .quiz-card__footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 10%;
      padding: 0 20px;
    }
    .quiz-card__button {
      padding: 8px 16px;
      color: #fff;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      font-size: 14px;
    }
    .quiz-card__button--previous {
      background-color: #007bff;
    }
    .quiz-card__button--previous:disabled {
      background-color: #e0e0e0;
      cursor: not-allowed;
    }
    .quiz-card__button--previous:hover:not(:disabled) {
      background-color: #0056b3;
    }
    .quiz-card__button--next {
      background-color: #007bff;
    }
    .quiz-card__button--next:disabled {
      background-color: #e0e0e0;
      cursor: not-allowed;
    }
    .quiz-card__button--next:hover:not(:disabled) {
      background-color: #0056b3;
    }
    .quiz-card__button--start {
      background-color: #28a745;
    }
    .quiz-card__button--start:hover {
      background-color: #218838;
    }
    .quiz-card__footer-controls {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .quiz-card__response-label {
      display: flex;
      align-items: center;
      font-size: 14px;
    }
    .quiz-card__response-input {
      margin-left: 5px;
      width: 20px;
      height: 20px;
      cursor: pointer;
    }
    .quiz-card__timer-select {
      padding: 8px;
      border-radius: 5px;
      border: 1px solid #ccc;
      font-size: 14px;
    }
    .quiz-card__timer {
      width: 40px;
      height: 40px;
      border: 2px solid #ff5733;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: bold;
      color: #ff5733;
      transition: transform 0.5s ease;
    }

    /* Mobile Responsive Styles */
    @media (max-width: 768px) {
      .quiz-card {
        width: 90vw;
        height: auto;
        min-height: 50vh; /* Reduced height */
        padding: 15px;
        margin: 15px auto;
      }
      .quiz-card__close {
        width: 25px;
        height: 25px;
        font-size: 14px;
      }
      .quiz-card__title {
        font-size: 20px;
        margin-bottom: 15px;
      }
      .quiz-card__content {
        flex-direction: row; /* Image and poll bars in same row */
        padding: 0 10px;
        gap: 10px;
      }
      .quiz-card__image {
        width: 40%; /* Reduced width */
        height: 120px; /* Reduced height */
      }
      .quiz-card__poll {
        width: 55%; /* Adjusted width */
        padding-bottom: 10px;
        flex-wrap: wrap;
        gap: 5px;
      }
      .quiz-card__poll-item {
        width: 45%;
        margin: 0 5px;
      }
      .quiz-card__poll-item--correct {
        font-size: 14px;
        top: -15px;
      }
      .quiz-card__poll-votes {
        font-size: 14px;
        margin-bottom: 5px;
      }
      .quiz-card__poll-bar {
        width: 30px;
        min-height: 15px;
      }
      .quiz-card__poll-label {
        font-size: 12px;
        margin-top: 5px;
      }
      .quiz-card__footer {
        flex-direction: column;
        gap: 8px;
        padding: 0 10px;
        height: auto;
      }
      .quiz-card__button {
        padding: 6px 12px;
        font-size: 12px;
      }
      .quiz-card__footer-controls {
        flex-direction: column;
        gap: 5px;
        width: 100%;
      }
      .quiz-card__response-label {
        font-size: 12px;
      }
      .quiz-card__response-input {
        width: 16px;
        height: 16px;
      }
      .quiz-card__button--start {
        padding: 6px 12px;
        font-size: 12px;
        width: 100%;
      }
      .quiz-card__timer-select {
        padding: 6px;
        font-size: 12px;
        width: 100%;
      }
      .quiz-card__timer {
        width: 30px;
        height: 30px;
        font-size: 10px;
      }
    }
  }

  /* Quiz Creation Form Styles */
  .quiz-form {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: #ffffff;
    padding: 30px;
    border-radius: 16px;
    box-shadow: 0 15px 40px rgba(0,0,0,0.25);
    z-index: 1001;
    width: 90%;
    max-width: 800px;
    max-height: 85vh;
    overflow-y: auto;
    border: 2px solid #333;
  }
  .quiz-form__title {
    font-size: 1.8rem;
    font-weight: 700;
    color: #1a3c5e;
    margin-bottom: 20px;
  }
  .quiz-form__input {
    width: 100%;
    padding: 10px;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    margin-bottom: 15px;
    font-size: 1rem;
  }
  .quiz-form__question {
    margin-bottom: 25px;
  }
  .quiz-form__question-title {
    font-size: 1.4rem;
    font-weight: 600;
    color: #2c3e50;
    margin-bottom: 15px;
  }
  .quiz-form__dropzone {
    border: 2px dashed #e2e8f0;
    border-radius: 10px;
    padding: 25px;
    text-align: center;
    margin-bottom: 20px;
    cursor: pointer;
  }
  .quiz-form__dropzone-text {
    margin: 0;
    color: #718096;
    font-size: 1rem;
  }
  .quiz-form__dropzone-image {
    max-width: 100%;
    max-height: 200px;
    border-radius: 10px;
    margin-top: 15px;
  }
  .quiz-form__option {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 15px;
  }
  .quiz-form__option-input {
    width: 100%;
    padding: 10px;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    font-size: 1rem;
  }
  .quiz-form__delete-icon {
    color: #e53e3e;
    cursor: pointer;
    font-size: 1.3rem;
  }
  .quiz-form__button {
    padding: 10px 20px;
    background: #3182ce;
    color: #fff;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 1rem;
  }
  .quiz-form__button--cancel {
    background: #e2e8f0;
    color: #2d3436;
  }
  .quiz-form__footer {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
  }
  .quiz-form__footer-buttons {
    display: flex;
    gap: 10px;
  }

  /* Mobile Responsive Styles for Quiz Form */
  @media (max-width: 768px) {
    .quiz-form {
      padding: 15px;
      width: 95%;
      max-width: none;
      min-height: 50vh; /* Reduced height */
    }
    .quiz-form__title {
      font-size: 1.5rem;
      margin-bottom: 15px;
    }
    .quiz-form__input {
      padding: 8px;
      font-size: 0.9rem;
    }
    .quiz-form__question {
      margin-bottom: 15px;
    }
    .quiz-form__question-title {
      font-size: 1.2rem;
      margin-bottom: 10px;
    }
    .quiz-form__dropzone {
      padding: 15px;
      margin-bottom: 15px;
    }
    .quiz-form__dropzone-text {
      font-size: 0.9rem;
    }
    .quiz-form__dropzone-image {
      max-height: 120px; /* Reduced image size */
      margin-top: 10px;
    }
    .quiz-form__option {
      gap: 8px;
      margin-bottom: 10px;
    }
    .quiz-form__option-input {
      padding: 8px;
      font-size: 0.9rem;
    }
    .quiz-form__delete-icon {
      font-size: 1rem;
    }
    .quiz-form__button {
      padding: 8px 15px;
      font-size: 0.9rem;
      width: 100%;
    }
    .quiz-form__footer {
      flex-direction: column;
      gap: 10px;
    }
    .quiz-form__footer-buttons {
      flex-direction: column;
      gap: 10px;
      width: 100%;
    }
  }
`;

const QuizAdmin = () => {
  const { id } = useParams(); // classId
  const [classData, setClassData] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showControlModal, setShowControlModal] = useState(false);
  const [controlQuizId, setControlQuizId] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [timerValue, setTimerValue] = useState(0);
  const [results, setResults] = useState([]);
  const [timerScale, setTimerScale] = useState(1);
  const [quizForm, setQuizForm] = useState({
    title: '',
    questions: [{ image: null, text: '', options: [{ text: '', isCorrect: false }, { text: '', isCorrect: false }, { text: '', isCorrect: false }, { text: '', isCorrect: false }], marks: 1 }],
  });
  const hasJoinedRef = useRef(false);

  useEffect(() => {
    const initializeAdmin = async () => {
      if (!id) {
        console.error('Class ID is undefined');
        toast.error('Invalid class ID');
        return;
      }

      if (hasJoinedRef.current) return;

      socket.emit('joinClass', id);
      console.log(`Admin joined classroom: ${id}`);
      hasJoinedRef.current = true;
    };

    initializeAdmin();

    const fetchData = async () => {
      try {
        const classResponse = await classGet(`/class/getclass/${id}`);
        const quizResponse = await classGet(`/quizes/quiz/${id}`);
        setClassData(classResponse.data.classData);
        setQuizzes(quizResponse.data.quizzes || []);
      } catch (error) {
        toast.error('Failed to load data.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();

    socket.on('updateResults', (data) => {
      console.log('Admin received updateResults:', data);
      setResults(data.submissions || []);
    });

    return () => {
      socket.off('updateResults');
      hasJoinedRef.current = false;
    };
  }, [id]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            socket.emit('updateQuestion', {
              quizId: controlQuizId,
              questionIndex: currentQuestionIndex,
              question: quizzes.find(q => q._id === controlQuizId)?.questions[currentQuestionIndex],
              showResults,
              timeLimit: 0,
              submitEnabled: false,
              classId: id,
            });
            return 0;
          }
          return prev - 1;
        });
        setTimerScale(prev => (prev === 1 ? 1.1 : 1));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft, currentQuestionIndex, showResults, controlQuizId, id]);

  const validateForm = () => {
    if (!quizForm.title.trim()) return false;
    return quizForm.questions.every(q => q.text.trim() && q.options.length >= 2 && q.options.some(opt => opt.isCorrect) && q.marks > 0 && q.options.every(opt => opt.text.trim()));
  };

  const handleCreateQuiz = async () => {
    if (!validateForm()) {
      toast.error('Please fill all required fields correctly.');
      return;
    }
    try {
      const formData = new FormData();
      formData.append('title', quizForm.title);
      formData.append('classId', id);
      const questionsData = quizForm.questions.map(q => ({
        text: q.text,
        marks: q.marks,
        options: q.options,
        image: q.image ? `questionImage${quizForm.questions.indexOf(q)}` : null,
      }));
      formData.append('questions', JSON.stringify(questionsData));
      quizForm.questions.forEach((q, i) => {
        if (q.image) formData.append('questionImage', q.image, `questionImage${i}`);
      });

      const response = await classPost('/quizes/quiz/create', formData);
      setQuizzes([...quizzes, response.data.quiz]);
      setShowForm(false);
      setQuizForm({ title: '', questions: [{ image: null, text: '', options: [{ text: '', isCorrect: false }, { text: '', isCorrect: false }, { text: '', isCorrect: false }, { text: '', isCorrect: false }], marks: 1 }] });
      toast.success('Quiz created successfully');
    } catch (error) {
      toast.error('Failed to create quiz.');
    }
  };

  const handleStartQuiz = async (quizId) => {
    try {
      await classPost(`/quizes/quiz/start/${quizId}`);
      const updatedQuizzes = quizzes.map(q => q._id === quizId ? { ...q, started: true, completed: false, submissions: [] } : q);
      setQuizzes(updatedQuizzes);
      setControlQuizId(quizId);
      setShowControlModal(true);
      setCurrentQuestionIndex(0);
      setTimeLeft(0);
      setTimerValue(0);
      setShowResults(false);
      setResults([]); // Reset results

      const quiz = updatedQuizzes.find(q => q._id === quizId);
      if (quiz && quiz.questions.length > 0) {
        socket.emit('quizStarted', { quizId, classId: id });
        await handleSetQuestion(quizId, 0);
        console.log('Admin started quiz and set initial question:', { quizId, classId: id });
      }
      toast.success(quiz.submissions?.length > 0 || quiz.completed ? 'Quiz restarted' : 'Quiz started');
    } catch (error) {
      toast.error('Failed to start quiz');
      console.error('Start quiz error:', error);
    }
  };

  const handleEndQuiz = async (quizId) => {
    try {
      await classPost(`/quizes/quiz/end/${quizId}`);
      setQuizzes(quizzes.map(q => q._id === quizId ? { ...q, completed: true } : q));
      setShowControlModal(false);
      socket.emit('quizEnded', { quizId, classId: id });
      toast.success('Quiz ended');
    } catch (error) {
      toast.error('Failed to end quiz');
    }
  };

  const handleDeleteQuiz = async (quizId) => {
    try {
      await classPost(`/quizes/quiz/delete/${quizId}`);
      setQuizzes(quizzes.filter(q => q._id !== quizId));
      toast.success('Quiz deleted');
    } catch (error) {
      toast.error('Failed to delete quiz');
    }
  };

  const handleDownloadQuiz = async (quizId, title) => {
    try {
      const response = await downloadFile(`/quizes/quiz/download/${quizId}`);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${title}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('Download started');
    } catch (error) {
      toast.error('Failed to download quiz.');
    }
  };

  const handleSetQuestion = async (quizId, index) => {
    try {
      await classPost(`/quizes/quiz/setQuestion/${quizId}`, { questionIndex: index, showResults, timeLimit: timeLeft, submitEnabled: timeLeft > 0 });
      setCurrentQuestionIndex(index);
      const quiz = quizzes.find(q => q._id === quizId);
      socket.emit('updateQuestion', {
        quizId,
        questionIndex: index,
        question: index >= 0 ? quiz.questions[index] : null,
        showResults,
        timeLimit: timeLeft,
        submitEnabled: timeLeft > 0,
        classId: id,
      });
      console.log('Admin emitted updateQuestion:', { quizId, questionIndex: index, classId: id });
    } catch (error) {
      toast.error('Failed to set question');
      console.error('Set question error:', error);
    }
  };

  const handleNextQuestion = () => {
    const quiz = quizzes.find(q => q._id === controlQuizId);
    if (currentQuestionIndex < quiz.questions.length - 1) {
      const nextIndex = currentQuestionIndex + 1;
      setTimeLeft(0);
      setShowResults(false);
      handleSetQuestion(controlQuizId, nextIndex);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      const prevIndex = currentQuestionIndex - 1;
      setTimeLeft(0);
      setShowResults(false);
      handleSetQuestion(controlQuizId, prevIndex);
    }
  };

  const handleStartTimer = () => {
    if (timerValue > 0) {
      setTimeLeft(timerValue);
      socket.emit('updateQuestion', {
        quizId: controlQuizId,
        questionIndex: currentQuestionIndex,
        question: quizzes.find(q => q._id === controlQuizId).questions[currentQuestionIndex],
        showResults,
        timeLimit: timerValue,
        submitEnabled: true,
        classId: id,
      });
      handleSetQuestion(controlQuizId, currentQuestionIndex);
    }
  };

  const handleToggleResults = () => {
    const newShowResults = !showResults;
    setShowResults(newShowResults);
    socket.emit('updateQuestion', {
      quizId: controlQuizId,
      questionIndex: currentQuestionIndex,
      question: quizzes.find(q => q._id === controlQuizId).questions[currentQuestionIndex],
      showResults: newShowResults,
      timeLimit: timeLeft,
      submitEnabled: timeLeft > 0,
      classId: id,
    });
    handleSetQuestion(controlQuizId, currentQuestionIndex);
  };

  const getPollData = (questionIndex) => {
    const quiz = quizzes.find(q => q._id === controlQuizId);
    if (!quiz || questionIndex < 0) return [];
    const question = quiz.questions[questionIndex];
    const totalVotes = results.reduce((count, sub) => count + (sub.answers[questionIndex] ? 1 : 0), 0);
    return question.options.map((opt, idx) => {
      const votes = results.reduce((count, sub) => count + (sub.answers[questionIndex] === opt.text ? 1 : 0), 0);
      return { option: opt.text, value: votes, color: idx % 3 === 0 ? '#4a90e2' : idx % 3 === 1 ? '#ff6f61' : '#ff3d00', isCorrect: opt.isCorrect };
    });
  };

  const handleAddQuestion = () => {
    setQuizForm({
      ...quizForm,
      questions: [...quizForm.questions, { image: null, text: '', options: [{ text: '', isCorrect: false }, { text: '', isCorrect: false }, { text: '', isCorrect: false }, { text: '', isCorrect: false }], marks: 1 }],
    });
  };

  const handleAddOption = (questionIndex) => {
    const newQuestions = [...quizForm.questions];
    newQuestions[questionIndex].options.push({ text: '', isCorrect: false });
    setQuizForm({ ...quizForm, questions: newQuestions });
  };

  const handleDeleteOption = (questionIndex, optionIndex) => {
    const newQuestions = [...quizForm.questions];
    newQuestions[questionIndex].options.splice(optionIndex, 1);
    setQuizForm({ ...quizForm, questions: newQuestions });
  };

  const handleImageDrop = (questionIndex, files) => {
    if (files && files.length > 0) {
      const newQuestions = [...quizForm.questions];
      newQuestions[questionIndex].image = files[0];
      setQuizForm({ ...quizForm, questions: newQuestions });
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="page-container">
      <style>{styles}</style>
      <div className="card-container">
        <div className="second-nav">
          <SecondNav classId={id} />
        </div>
        <h2 className="class-name">{classData?.ClassName || 'No class data'}</h2>
        <button
          style={{ padding: '10px 20px', background: '#3182ce', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '1rem' }}
          onClick={() => setShowForm(true)}
        >
          Create Quiz
        </button>
        {quizzes.map(quiz => (
          <div key={quiz._id} style={{ background: '#f9fafb', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '20px', margin: '15px 0' }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#2c3e50' }}>{quiz.title}</h3>
            <div style={{ color: '#4a5568' }}>
              <div>{quiz.questions.length} Questions</div>
              <div>{quiz.totalMarks || 0} Marks</div>
              <div>Responses: {quiz.submissions.length}</div>
            </div>
            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              <button style={{ padding: '10px 20px', background: '#28a745', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }} onClick={() => handleStartQuiz(quiz._id)}>
                Start
              </button>
              <button style={{ padding: '10px 20px', background: '#e53e3e', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }} onClick={() => handleDeleteQuiz(quiz._id)}>
                Delete
              </button>
              <button style={{ padding: '10px 20px', background: '#007bff', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }} onClick={() => handleDownloadQuiz(quiz._id, quiz.title)}>
                Download
              </button>
            </div>
          </div>
        ))}
      </div>

      {showControlModal && controlQuizId && (
        <>
          <div className="backdrop"></div>
          <div className="quiz-card">
            <button
              className="quiz-card__close"
              onClick={() => handleEndQuiz(controlQuizId)}
            >
              ✖
            </button>

            <div className="quiz-card__title">
              {quizzes.find(q => q._id === controlQuizId)?.questions[currentQuestionIndex]?.text || 'No Question'}
            </div>

            <div className="quiz-card__content">
              <div className="quiz-card__image">
                {quizzes.find(q => q._id === controlQuizId)?.questions[currentQuestionIndex]?.image ? (
                  <img
                    src={`http://localhost:8000/images/${quizzes.find(q => q._id === controlQuizId).questions[currentQuestionIndex].image}`}
                    alt="Question"
                    onError={(e) => console.error('Image load error:', e.target.src)}
                  />
                ) : (
                  <img src="https://via.placeholder.com/300x200" alt="Placeholder" />
                )}
              </div>
              <div className="quiz-card__poll">
                {getPollData(currentQuestionIndex).map(({ option, value, color, isCorrect }) => (
                  <div key={option} className="quiz-card__poll-item">
                    {isCorrect && showResults && (
                      <span className="quiz-card__poll-item--correct">✔</span>
                    )}
                    <span className="quiz-card__poll-votes">{showResults ? value : 0}</span>
                    <div
                      className="quiz-card__poll-bar"
                      style={{
                        height: `${showResults ? value * 20 : 0}px`,
                        backgroundColor: color,
                      }}
                    ></div>
                    <span className="quiz-card__poll-label">{option}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="quiz-card__footer">
              <div>
                <button
                  className="quiz-card__button quiz-card__button--previous"
                  onClick={handlePreviousQuestion}
                  disabled={currentQuestionIndex <= 0}
                >
                  Previous
                </button>
              </div>
              <div className="quiz-card__footer-controls">
                <label className="quiz-card__response-label">
                  Response:
                  <input
                    type="checkbox"
                    className="quiz-card__response-input"
                    checked={showResults}
                    onChange={handleToggleResults}
                  />
                </label>
                <button
                  className="quiz-card__button quiz-card__button--start"
                  onClick={handleStartTimer}
                >
                  Start
                </button>
                <select
                  className="quiz-card__timer-select"
                  value={timerValue}
                  onChange={(e) => setTimerValue(parseInt(e.target.value))}
                >
                  <option value={0}>0 sec</option>
                  <option value={10}>10 sec</option>
                  <option value={20}>20 sec</option>
                  <option value={30}>30 sec</option>
                </select>
                <div
                  className="quiz-card__timer"
                  style={{ transform: `scale(${timerScale})` }}
                >
                  {timeLeft}s
                </div>
              </div>
              <div>
                <button
                  className="quiz-card__button quiz-card__button--next"
                  onClick={handleNextQuestion}
                  disabled={currentQuestionIndex >= quizzes.find(q => q._id === controlQuizId)?.questions.length - 1}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {showForm && (
        <>
          <div className="backdrop"></div>
          <div className="quiz-form">
            <h3 className="quiz-form__title">Create Quiz</h3>
            <input
              className="quiz-form__input"
              value={quizForm.title}
              onChange={e => setQuizForm({ ...quizForm, title: e.target.value })}
              placeholder="Quiz Title"
            />
            {quizForm.questions.map((q, i) => (
              <div key={i} className="quiz-form__question">
                <h4 className="quiz-form__question-title">Question {i + 1}</h4>
                <div
                  className="quiz-form__dropzone"
                  onDrop={(e) => {
                    e.preventDefault();
                    handleImageDrop(i, e.dataTransfer.files);
                  }}
                  onDragOver={e => e.preventDefault()}
                  onClick={() => document.getElementById(`file-input-${i}`).click()}
                >
                  <p className="quiz-form__dropzone-text">Drag & Drop an Image or Click to Browse</p>
                  <input
                    id={`file-input-${i}`}
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={(e) => handleImageDrop(i, e.target.files)}
                  />
                  {q.image && <img src={URL.createObjectURL(q.image)} alt="Preview" className="quiz-form__dropzone-image" />}
                </div>
                <input
                  className="quiz-form__input"
                  value={q.text}
                  onChange={e => {
                    const newQuestions = [...quizForm.questions];
                    newQuestions[i].text = e.target.value;
                    setQuizForm({ ...quizForm, questions: newQuestions });
                  }}
                  placeholder="Question"
                />
                {q.options.map((opt, j) => (
                  <div key={j} className="quiz-form__option">
                    <input
                      type="checkbox"
                      checked={opt.isCorrect}
                      onChange={e => {
                        const newQuestions = [...quizForm.questions];
                        newQuestions[i].options[j].isCorrect = e.target.checked;
                        setQuizForm({ ...quizForm, questions: newQuestions });
                      }}
                    />
                    <input
                      className="quiz-form__option-input"
                      value={opt.text}
                      onChange={e => {
                        const newQuestions = [...quizForm.questions];
                        newQuestions[i].options[j].text = e.target.value;
                        setQuizForm({ ...quizForm, questions: newQuestions });
                      }}
                      placeholder={`Option ${j + 1}`}
                    />
                    <FaTrash className="quiz-form__delete-icon" onClick={() => handleDeleteOption(i, j)} />
                  </div>
                ))}
                <button
                  className="quiz-form__button"
                  onClick={() => handleAddOption(i)}
                >
                  Add Option
                </button>
                <input
                  className="quiz-form__input"
                  type="number"
                  value={q.marks}
                  onChange={e => {
                    const newQuestions = [...quizForm.questions];
                    newQuestions[i].marks = parseInt(e.target.value) || 1;
                    setQuizForm({ ...quizForm, questions: newQuestions });
                  }}
                  placeholder="Marks"
                />
              </div>
            ))}
            <div className="quiz-form__footer">
              <button
                className="quiz-form__button"
                onClick={handleAddQuestion}
              >
                Add Question
              </button>
              <div className="quiz-form__footer-buttons">
                <button
                  className="quiz-form__button"
                  onClick={handleCreateQuiz}
                >
                  Submit
                </button>
                <button
                  className="quiz-form__button quiz-form__button--cancel"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default QuizAdmin;