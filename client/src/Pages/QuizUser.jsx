import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';
import SecondNavUs from '../Components/SecondNavUs';
import { classGet, classPost, getUser } from '../services/Endpoint';
import toast from 'react-hot-toast';

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
    margin-bottom: 30px;
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
  .quiz-card__options {
    width: 48%;
    display: flex;
    flex-direction: column;
    gap: 15px;
  }
  .quiz-card__option {
    font-size: 16px;
    font-weight: 500;
    color: #333;
    display: flex;
    align-items: center;
  }
  .quiz-card__option input {
    margin-right: 10px;
    width: 20px;
    height: 20px;
    cursor: pointer;
  }
  .quiz-card__footer {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    height: 10%;
    padding: 0 20px;
  }
  .quiz-card__submit {
    padding: 8px 16px;
    background-color: #007bff;
    color: #fff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 14px;
    margin-right: 10px;
  }
  .quiz-card__submit:disabled {
    background-color: #e0e0e0;
    cursor: not-allowed;
  }
  .quiz-card__submit:hover:not(:disabled) {
    background-color: #0056b3;
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
    transform: scale(1);
    transition: transform 0.5s ease;
  }

  /* Mobile Responsive Styles */
  @media (max-width: 768px) {
    .quiz-card {
      width: 90vw;
      height: auto;
      min-height: 40vh;
      padding: 10px;
      margin: 10px auto;
    }
    .quiz-card__close {
      width: 20px;
      height: 20px;
      font-size: 12px;
      top: 5px;
      right: 5px;
    }
    .quiz-card__title {
      font-size: 18px;
      margin-top: 20px; /* Moved lower from top */
      margin-bottom: 10px;
    }
    .quiz-card__content {
      flex-direction: column;
      padding: 0 5px;
      gap: 5px;
      align-items: center; /* Center content */
    }
    .quiz-card__image {
      width: 70%; /* Reduced width */
      height: 120px; /* Increased height slightly */
      margin-bottom: 5px;
    }
    .quiz-card__options {
      width: 100%;
      gap: 5px; /* Reduced gap between options */
      margin-top: 0; /* No extra margin above options */
    }
    .quiz-card__option {
      font-size: 14px;
    }
    .quiz-card__option input {
      width: 16px;
      height: 16px;
      margin-right: 5px;
    }
    .quiz-card__footer {
      padding: 5px 10px;
      height: auto;
      flex-direction: row; /* Submit and timer in same row */
      gap: 5px;
      justify-content: center; /* Center the footer content */
      margin-top: 5px; /* Reduced gap above footer */
    }
    .quiz-card__submit {
      padding: 5px 10px;
      font-size: 12px;
      margin-right: 5px; /* Small gap between submit and timer */
      width: auto;
    }
    .quiz-card__timer {
      width: 30px;
      height: 30px;
      font-size: 10px;
    }
  }
}
`;

const QuizUser = () => {
  const { id } = useParams(); // classId
  const [classData, setClassData] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [answer, setAnswer] = useState('');
  const [timeLeft, setTimeLeft] = useState(0);
  const [submitEnabled, setSubmitEnabled] = useState(false);
  const [showQuestionCard, setShowQuestionCard] = useState(false);
  const [timerScale, setTimerScale] = useState(1);
  const [quizStarted, setQuizStarted] = useState(false);
  const [userEmail, setUserEmail] = useState(null);
  const hasJoinedRef = useRef(false);

  useEffect(() => {
    const initializeUser = async () => {
      if (!id) {
        console.error('Class ID is undefined');
        toast.error('Invalid class ID');
        return;
      }

      if (hasJoinedRef.current) return;

      try {
        const userResponse = await getUser();
        const email = userResponse.data.user.email;
        if (!email) throw new Error('User email not found in response');
        setUserEmail(email);
        localStorage.setItem('email', email);
        socket.emit('joinClass', { classId: id, userEmail: email });
        console.log(`User ${email} with socket ${socket.id} joined classroom: ${id}`);
      } catch (error) {
        console.error('Failed to fetch user email:', error);
        const fallbackEmail = `anonymous_${socket.id}`; // Unique fallback
        setUserEmail(fallbackEmail);
        socket.emit('joinClass', { classId: id, userEmail: fallbackEmail });
        console.log(`User ${fallbackEmail} with socket ${socket.id} joined classroom: ${id}`);
      }
      hasJoinedRef.current = true;
    };

    initializeUser();

    socket.on('connect', () => {
      console.log('User connected to Socket.IO:', socket.id);
    });

    return () => {
      socket.off('connect');
      hasJoinedRef.current = false;
    };
  }, [id]);

  useEffect(() => {
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

    socket.on('quizStarted', ({ quizId, classId }) => {
      if (classId === id) {
        console.log('User received quizStarted:', { quizId, classId });
        setQuizStarted(true);
        setActiveQuiz(quizzes.find(q => q._id === quizId) || null);
      }
    });

    socket.on('updateQuestion', ({ quizId, questionIndex, question, timeLimit, submitEnabled, classId }) => {
      if (classId === id && quizId === activeQuiz?._id) {
        console.log('User received updateQuestion:', { quizId, questionIndex, question, timeLimit, submitEnabled, classId });
        setCurrentQuestion(questionIndex >= 0 ? { index: questionIndex, ...question } : null);
        setTimeLeft(timeLimit || 0);
        setSubmitEnabled(submitEnabled);
        setAnswer('');
        setShowQuestionCard(true);
      }
    });

    socket.on('quizEnded', ({ quizId, classId }) => {
      if (classId === id && activeQuiz?._id === quizId) {
        console.log('User received quizEnded:', { quizId, classId });
        setShowQuestionCard(false);
        setActiveQuiz(null);
        setQuizStarted(false);
      }
    });

    return () => {
      socket.off('quizStarted');
      socket.off('updateQuestion');
      socket.off('quizEnded');
    };
  }, [id, quizzes, activeQuiz]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => (prev <= 1 ? 0 : prev - 1));
        setTimerScale(prev => (prev === 1 ? 1.1 : 1));
      }, 1000);
      return () => clearInterval(timer);
    } else {
      setSubmitEnabled(false);
    }
  }, [timeLeft]);

  const handleJoinQuiz = () => {
    if (activeQuiz && userEmail) {
      socket.emit('joinQuiz', { quizId: activeQuiz._id, classId: id, userEmail });
      console.log(`User ${userEmail} with socket ${socket.id} joined quiz: ${activeQuiz._id}`);
      socket.emit('requestCurrentQuestion', { quizId: activeQuiz._id, classId: id });
    }
  };

  const handleSubmitAnswer = async () => {
    if (!answer || !submitEnabled) return;
    try {
      await classPost(`/quizes/quiz/submit/${activeQuiz._id}`, { questionIndex: currentQuestion.index, answer });
      toast.success('Answer submitted');
    } catch (error) {
      toast.error('Failed to submit answer');
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="page-container">
      <style>{styles}</style>
      <div className="card-container">
        <div className="second-nav">
          <SecondNavUs classId={id} />
        </div>
        <h2 className="class-name">{classData?.ClassName || 'No class data'}</h2>
        {quizStarted && !showQuestionCard && (
          <div style={{ textAlign: 'center', margin: '20px 0' }}>
            <p style={{ fontSize: '1.2rem', color: '#333' }}>A quiz has started! Join now to participate.</p>
            <button
              style={{
                padding: '10px 20px',
                backgroundColor: '#28a745',
                color: '#fff',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '1rem',
              }}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#218838')}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#28a745')}
              onClick={handleJoinQuiz}
            >
              Join Quiz
            </button>
          </div>
        )}
      </div>
      {showQuestionCard && activeQuiz && (
        <div className="quiz-card">
          <button
            className="quiz-card__close"
            onClick={() => setShowQuestionCard(false)}
          >
            ✖
          </button>

          <div className="quiz-card__title">
            {currentQuestion?.text || 'Waiting for question...'}
          </div>

          <div className="quiz-card__content">
            <div className="quiz-card__image">
              {currentQuestion?.image ? (
                <img
                  src={`http://localhost:8000/images/${currentQuestion.image}`}
                  alt="Question"
                  onError={(e) => console.error('Image load error:', e.target.src)}
                />
              ) : (
                <img src="https://via.placeholder.com/300x200" alt="Placeholder" />
              )}
            </div>
            <div className="quiz-card__options">
              {currentQuestion?.options?.map((opt, idx) => (
                <label key={idx} className="quiz-card__option">
                  <input
                    type="radio"
                    name={`q${currentQuestion.index}`}
                    value={opt.text}
                    checked={answer === opt.text}
                    onChange={(e) => setAnswer(e.target.value)}
                    disabled={!submitEnabled}
                  />
                  {opt.text}
                </label>
              ))}
            </div>
          </div>

          <div className="quiz-card__footer">
            <button
              className="quiz-card__submit"
              onClick={handleSubmitAnswer}
              disabled={!submitEnabled || !answer}
            >
              Submit
            </button>
            <div
              className="quiz-card__timer"
              style={{ transform: `scale(${timerScale})` }}
            >
              {timeLeft}s
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizUser;