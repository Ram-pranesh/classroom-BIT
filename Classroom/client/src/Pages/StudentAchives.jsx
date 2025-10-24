import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import MentorNav from '../Components/MentorNav'; // Adjust path based on your project structure

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
    margin-top: 4.5rem;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  /* Style for MentorNav to merge with the top of the card */
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

  /* Student Cards */
  .student-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1rem;
  }

  .student-card {
    background-color: #f9f9f9;
    border-radius: 0.5rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    padding: 1rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    transition: transform 0.2s;
    cursor: pointer;
  }

  .student-card:hover {
    transform: scale(1.05);
  }

  .student-photo {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    object-fit: cover;
    margin-bottom: 0.5rem;
  }

  .student-name {
    font-size: 1.2rem;
    font-weight: 600;
    color: #333;
    margin-bottom: 0.25rem;
  }

  .student-email,
  .student-mobile {
    font-size: 0.9rem;
    color: #666;
    margin-bottom: 0.25rem;
  }

  /* Selected Student Container */
  .selected-student-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }

  /* Back Button */
  .back-button {
    background-color: #6b48ff;
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    border: none;
    cursor: pointer;
    font-size: 1rem;
    font-weight: 500;
    transition: background-color 0.2s;
  }

  .back-button:hover {
    background-color: #5a3de6;
  }

  /* No Data Message */
  .no-data {
    text-align: center;
    color: #666;
    font-size: 1.1rem;
    margin-top: 2rem;
  }

  /* Responsive adjustments */
  @media (max-width: 768px) {
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

    .student-grid {
      grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    }

    .student-photo {
      width: 60px;
      height: 60px;
    }

    .student-name {
      font-size: 1rem;
    }

    .student-email,
    .student-mobile {
      font-size: 0.8rem;
    }

    .back-button {
      padding: 0.4rem 0.8rem;
      font-size: 0.9rem;
    }
  }
`;

const StudentAchives = () => {
  const { classId } = useParams();
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Load students from localStorage on mount
  useEffect(() => {
    const savedStudents = JSON.parse(localStorage.getItem('students')) || [];
    setStudents(savedStudents);
  }, []);

  const handleStudentClick = (student) => {
    setSelectedStudent(student);
  };

  const handleBackClick = () => {
    setSelectedStudent(null);
  };

  return (
    <>
      <style>{styles}</style>
      <div className="page-container">
        <div className="card-container">
          <div className="second-nav">
            <MentorNav classId={classId} />
          </div>
          <h1 className="class-name">Student Details</h1>

          {students.length === 0 ? (
            <div className="no-data">
              <p>No students found. Add students in the Add Students page.</p>
            </div>
          ) : selectedStudent ? (
            <div className="selected-student-container">
              <div className="student-card">
                <img src={selectedStudent.photo} alt={selectedStudent.name} className="student-photo" />
                <div className="student-name">{selectedStudent.name}</div>
                <div className="student-email">{selectedStudent.email}</div>
                <div className="student-mobile">{selectedStudent.mobile}</div>
              </div>
              <button className="back-button" onClick={handleBackClick}>
                Back to All Students
              </button>
            </div>
          ) : (
            <div className="student-grid">
              {students.map((student, index) => (
                <div
                  key={index}
                  className="student-card"
                  onClick={() => handleStudentClick(student)}
                >
                  <img src={student.photo} alt={student.name} className="student-photo" />
                  <div className="student-name">{student.name}</div>
                  <div className="student-email">{student.email}</div>
                  <div className="student-mobile">{student.mobile}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default StudentAchives;