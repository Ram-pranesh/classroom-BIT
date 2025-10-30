// StudentDetailsMentor.jsx
import React, { useEffect, useState } from 'react';
const defaultDp = "https://ui-avatars.com/api/?name=Student&background=ddd&color=555";
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import MentorNav from '../Components/MentorNav';
import axios from 'axios';
const BaseUrl = import.meta.env.VITE_SERVER_APP_URL;

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
    width: 860px; /* Ensures 3 cards fit perfectly */
    max-width: 100vw;
    min-width: 320px;
    padding: 0 2rem 2rem 2rem;
    margin-top: 4.5rem;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    box-sizing: border-box;
    overflow-x: auto;
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

  .section-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: #000;
    margin-bottom: 1rem;
    text-align: left;
  }

  /* Form Styles */
  .form-container {
    width: 100%;
    padding: 1.5rem;
    background-color: transparent;
    border: none;
    box-shadow: none;
  }

  .form-label {
    display: block;
    font-size: 1.1rem;
    font-weight: 600;
    color: #000;
    margin-bottom: 0.5rem;
  }

  .form-input {
    width: 100%;
    padding: 0.75rem;
    background-color: #fff;
    border: 1px solid #d1d5db;
    border-radius: 0.5rem;
    font-size: 1rem;
    color: #333;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    transition: border-color 0.2s, box-shadow 0.2s;
  }

  .form-input:focus {
    outline: none;
    border-color: #6b48ff;
    box-shadow: 0 0 0 3px rgba(107, 72, 255, 0.2);
  }

  .form-input::placeholder {
    color: #999;
    font-style: italic;
  }

  .form-button {
    padding: 0.75rem 1.5rem;
    background-color: #6b48ff;
    color: #fff;
    border: none;
    border-radius: 0.5rem;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.2s, transform 0.2s;
  }

  .form-button:hover {
    background-color: #5a3de6;
    cursor: pointer;
    transform: scale(1.02);
  }

  .form-button:disabled {
    background-color: #a3a3a3;
    cursor: not-allowed;
  }

  .button-row {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 1.5rem;
  }

  /* Classmates List Styles */
  .classmates-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }

  .classmates-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: #000;
  }

  .student-count {
    font-size: 1rem;
    font-weight: 500;
    color: #666;
  }

  .classmates-list {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .classmate-item {
    display: flex;
    align-items: center;
    padding: 0.75rem 0;
    border-bottom: 1px solid #e5e7eb;
  }

  .classmate-email {
    font-size: 1rem;
    font-weight: 500;
    color: #333;
    flex: 1;
  }

  .delete-button {
    color: #dc3545;
    transition: color 0.2s, transform 0.2s;
  }

  .delete-button:hover {
    color: #b02a37;
    cursor: pointer;
    transform: scale(1.1);
  }

  /* Notification Modal */
  .notification-modal {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    color: #000;
    padding: 1.5rem;
    border-radius: 0.5rem;
    box-shadow: 0 0 15px 5px rgba(107, 72, 255, 0.3),
                0 0 15px 5px rgba(0, 122, 255, 0.3);
    text-align: center;
    z-index: 1000;
    animation: fadeIn 0.3s ease-in-out;
  }

  .notification-title {
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
  }

  .notification-message {
    font-size: 1rem;
    font-weight: 400;
  }

  .notification-success .notification-title,
  .notification-success .notification-message {
    color: #28a745;
  }

  .notification-error .notification-title,
  .notification-error .notification-message {
    color: #dc3545;
  }

  /* Animations */
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translate(-50%, -60%);
    }
    to {
      opacity: 1;
      transform: translate(-50%, -50%);
    }
  }

  /* No Data Message */
  .no-data {
    text-align: center;
    color: #666;
    font-size: 1.1rem;
    margin-top: 2rem;
  }

  /* Loading Spinner */
  .spinner {
    width: 4rem;
    height: 4rem;
    border: 4px solid #6b48ff;
    border-top: 4px solid transparent;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  /* Responsive adjustments */
  @media (max-width: 768px) {
    .card-container {
      padding: 0 1rem 1rem 1rem;
      margin-top: 0.5rem;
    }

    .second-nav {
      margin: 0 -<|control9|>rem;
      padding: 0.75rem 0;
    }

    .class-name {
      font-size: 1.8rem;
    }

    .classmate-email {
      font-size: 0.9rem;
    }
  }
  @media (max-width: 900px) {
    .card-container {
      width: 98vw;
      padding: 0 0.5rem 1rem 0.5rem;
    }
    .student-detail-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 1.2rem;
    }
  }
  @media (max-width: 600px) {
    .card-container {
      width: 100vw;
      padding: 0 0.2rem 0.5rem 0.2rem;
    }
    .student-detail-grid {
      grid-template-columns: 1fr;
      gap: 1rem;
    }
    .student-detail-card {
      min-height: 180px;
      max-width: 100%;
    }
  }

  .student-detail-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem;
    margin-top: 2rem;
    width: 100%;
    box-sizing: border-box;
  }
  .student-detail-card {
    background: #fff;
    border-radius: 2rem;
    box-shadow: 0 6px 24px rgba(107,72,255,0.13);
    padding: 2rem 1rem 1.5rem 1rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 220px;
    max-width: 260px;
    width: 100%;
    box-sizing: border-box;
    transition: box-shadow 0.3s, transform 0.3s;
    animation: fadeInUp 0.5s;
  }
  .student-detail-card:hover {
    box-shadow: 0 12px 32px rgba(107,72,255,0.18);
    transform: translateY(-2px) scale(1.03);
  }
  .student-dp {
    width: 130px;
    height: 130px;
    border-radius: 50%;
    object-fit: cover;
    background: #f3f3f3;
    border: 4px solid #6b48ff;
    margin-bottom: 1.2rem;
    margin-top: 0.5rem;
    box-shadow: 0 2px 8px rgba(107,72,255,0.08);
  }
  .student-name {
    font-size: 1.25rem;
    color: #333;
    font-weight: 700;
    margin-bottom: 1.2rem;
    text-align: center;
    letter-spacing: 1px;
    text-transform: uppercase;
    white-space: nowrap;
    overflow-x: auto;
    overflow-y: hidden;
    max-width: 90%;
    scrollbar-width: none;
  }
  .student-name::-webkit-scrollbar {
    height: 6px;
    background: #f3f3f3;
  }
  .student-name::-webkit-scrollbar-thumb {
    background: #6b48ff;
    border-radius: 3px;
  }
  .preview-button {
    background-color: #28a745;
    color: #fff;
    padding: 10px 24px;
    border: none;
    border-radius: 0.7rem;
    font-size: 1rem;
    font-weight: 700;
    cursor: pointer;
    transition: background-color 0.2s, box-shadow 0.2s;
    box-shadow: 0 2px 8px rgba(107,72,255,0.08);
    margin-top: auto;
  }
  .preview-button:hover {
    background-color: #218838;
    box-shadow: 0 4px 12px rgba(107,72,255,0.15);
  }
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(30px);}
    to { opacity: 1; transform: translateY(0);}
  }

  .resume-container {
    font-family: 'Arial', sans-serif;
    color: #333;
    line-height: 1.8;
    padding: 30px;
    background-color: #fff;
    max-width: 800px;
    margin: 0 auto;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }

  .resume-header {
    text-align: center;
    margin-bottom: 2.5rem;
    padding-bottom: 1.5rem;
    border-bottom: 3px solid #005555;
  }

  .resume-header h1 {
    font-size: 2.4rem;
    font-weight: 700;
    margin: 0;
    color: #005555;
    text-transform: uppercase;
    letter-spacing: 1.5px;
  }

  .resume-header h2 {
    font-size: 1.3rem;
    font-weight: 500;
    margin: 0.6rem 0 0;
    color: #555;
  }

  .resume-photo {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    object-fit: cover;
    border: 3px solid #005555;
    margin: 1.5rem auto;
    display: block;
  }

  .resume-contact {
    display: flex;
    flex-wrap: wrap;
    gap: 1.5rem;
    justify-content: center;
    margin-bottom: 1.5rem;
  }

  .resume-contact p {
    font-size: 0.95rem;
    margin: 0;
    color: #444;
  }

  .resume-section {
    margin-bottom: 2rem;
  }

  .resume-section h3 {
    font-size: 1.6rem;
    font-weight: 600;
    color: #005555;
    text-transform: uppercase;
    margin-bottom: 1.2rem;
    border-bottom: 2px solid #e0e0e0;
    padding-bottom: 0.6rem;
  }

  .resume-section h4 {
    font-size: 1.25rem;
    font-weight: 600;
    margin: 0.6rem 0;
    color: #333;
  }

  .resume-section p {
    font-size: 0.95rem;
    margin: 0.4rem 0;
    color: #444;
  }

  .resume-section ul {
    list-style-type: disc;
    margin-left: 25px;
    padding-left: 10px;
  }

  .resume-section ul li {
    font-size: 0.95rem;
    margin-bottom: 0.6rem;
    color: #444;
  }

  .resume-item {
    margin-bottom: 1.5rem;
  }

  .preview-modal-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0,0,0,0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
  }
  .preview-modal {
    background: transparent;
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: none;
    border-radius: 0;
    padding: 0;
  }
  .resume-container {
    background: #fff;
    width: 794px;
    height: 1123px;
    max-width: 95vw;
    max-height: 95vh;
    overflow-y: auto;
    box-shadow: 0 8px 32px rgba(0,0,0,0.18);
    border-radius: 1rem;
    margin: auto;
    padding: 40px 48px;
    position: relative;
    display: flex;
    flex-direction: column;
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* IE 10+ */
  }
  .resume-container::-webkit-scrollbar {
    display: none;
  }
  .preview-modal-close {
    position: absolute;
    top: 24px;
    right: 32px;
    background-color: #ff4d4f;
    color: #fff;
    padding: 0.5rem;
    border-radius: 50%;
    cursor: pointer;
    font-size: 1.5rem;
    z-index: 10001;
    border: none;
  }
  @media (max-width: 900px) {
    .resume-container {
      width: 95vw;
      height: 95vh;
      padding: 16px 8px;
    }
    .preview-modal-close {
      top: 12px;
      right: 12px;
    }
  }

  /* Enhanced modal animation */
  @keyframes modalFadeInUp {
    from {
      opacity: 0;
      transform: scale(0.96) translateY(40px);
    }
    to {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
  }
  .preview-modal-container {
    animation: modalFadeInUp 0.5s cubic-bezier(0.23, 1, 0.32, 1);
  }
  .preview-modal {
    animation: modalFadeInUp 0.5s cubic-bezier(0.23, 1, 0.32, 1);
  }
`;

const StudentDetailsMentor = () => {
  const [students, setStudents] = useState([]);
  const [previewData, setPreviewData] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [studentPhotos, setStudentPhotos] = useState({}); // Changed from userPhoto to studentPhotos
  const navigate = useNavigate();
  const { classId } = useParams();
  const location = useLocation();

  useEffect(() => {
    const students = JSON.parse(localStorage.getItem('students')) || [];
    setStudents(students);
    
    // Fetch photos for all students
    students.forEach(student => {
      fetchStudentPhoto(student.email);
    });
  }, [location]);

  // Fetch individual student's photo
  const fetchStudentPhoto = async (email) => {
    if (!email) return;
    
    try {
      const response = await fetch(
        `${BaseUrl}/api/achievements?userEmail=${encodeURIComponent(email)}`
      );
      
      if (!response.ok) {
        console.log('No achievement data found for', email);
        return;
      }
      
      const data = await response.json();
      console.log('Achievement data for', email, ':', data);
      
      if (data?.achievement?.personalDetails?.photo) {
        const photo = data.achievement.personalDetails.photo;
        let photoUrl = null;
        
        if (typeof photo === 'string' && photo.startsWith('data:')) {
          photoUrl = photo;
        } else if (photo.data && photo.contentType) {
          photoUrl = `data:${photo.contentType};base64,${photo.data}`;
        }
        
        if (photoUrl) {
          setStudentPhotos(prev => ({
            ...prev,
            [email]: photoUrl
          }));
        }
      }
    } catch (error) {
      console.error('Error fetching photo for', email, ':', error);
    }
  };

  // Preview button logic (fetch achievement data and show modal)
  const handlePreview = async (email) => {
    try {
      const res = await axios.get(
        `${BaseUrl}/api/achievements?userEmail=${encodeURIComponent(email)}`
      );
      if (res.data && res.data.achievement) {
        setPreviewData(res.data.achievement);
        setShowPreview(true);
      } else {
        alert('No achievement data found for this student.');
      }
    } catch (err) {
      alert('No achievement data found for this student.');
    }
  };

  // Helper functions for rendering resume
  const handlePhotoDisplay = (photo) => {
    if (!photo) {
      return 'https://via.placeholder.com/150'; // Default placeholder
    }

    // If photo is already a base64 data URL
    if (typeof photo === 'string' && photo.startsWith('data:')) {
      return photo;
    }

    // If photo has data and contentType properties (from MongoDB)
    if (photo.data && photo.contentType) {
      return `data:${photo.contentType};base64,${photo.data}`;
    }

    // If photo is a Blob or File object
    if (photo instanceof Blob || photo instanceof File) {
      return URL.createObjectURL(photo);
    }

    // Fallback to placeholder
    return 'https://via.placeholder.com/150';
  };

  const skills = previewData?.skills?.skills
    ? previewData.skills.skills.split(',').map(skill => skill.trim())
    : [];
  const languages = previewData?.languages?.language
    ? previewData.languages.language.split(',').map(lang => lang.trim())
    : [];

  const handleClosePreview = () => {
    setShowPreview(false);
    setPreviewData(null);
  };

  // Helper to parse name from email
  function parseNameFromEmail(email) {
    // Example: sabarivelant.cs24@bitsathy.ac.in -> SABARIVELAN T
    if (!email) return '';
    let namePart = email.split('@')[0]; // sabarivelant.cs24
    const match = namePart.match(/[.@]/);
    let name = '';
    let initial = '';
    if (match) {
      const idx = match.index;
      // Name: everything before the last character before special char
      name = namePart.substring(0, idx - 1).toUpperCase();
      // Initial: the last character before the special char
      initial = namePart.substring(idx - 1, idx).toUpperCase();
    } else {
      name = namePart.toUpperCase();
    }
    return initial ? `${name} ${initial}` : name;
  }

  return (
    <div className="page-container">
      <style>{styles}</style>
      <div className="card-container">
        <MentorNav classId={classId} />
        <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#6b48ff', textAlign: 'center', marginBottom: '0.5rem' }}>
          Student Details
        </h2>
        {students.length === 0 ? (
          <div className="no-data">
            No students found. Add students in the Add Students page.
          </div>
        ) : (
          <div className="student-detail-grid">
            {students.map((student, idx) => (
              <div className="student-detail-card" key={idx}>
                <img 
                  src={studentPhotos[student.email] || defaultDp} 
                  alt="Student DP" 
                  className="student-dp"
                  onError={(e) => {
                    e.target.src = defaultDp;
                  }}
                />
                <div
                  className="student-name"
                  style={{
                    fontSize:
                      parseNameFromEmail(student.email).length > 15
                        ? '1rem'
                        : '1.25rem',
                    maxWidth: '90%',
                  }}
                  title={parseNameFromEmail(student.email)}
                >
                  {parseNameFromEmail(student.email)}
                </div>
                <button className="preview-button" onClick={() => handlePreview(student.email)}>
                  Preview
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Move the modal OUTSIDE the card-container */}
      {showPreview && previewData && (
        <div className="preview-modal-container">
          <div className="preview-modal">
            <button className="preview-modal-close" onClick={handleClosePreview}>
              ✕
            </button>
            <div id="resume-preview" className="resume-container">
              {/* Header Section */}
              <div className="resume-header">
                <h1>{previewData.personalDetails?.name || 'Your Name'}</h1>
                <h2>Professional Profile</h2>
                {handlePhotoDisplay(previewData.personalDetails?.photo) && (
                  <img src={handlePhotoDisplay(previewData.personalDetails?.photo)} alt="Profile" className="resume-photo" />
                )}
                <div className="resume-contact">
                  <p>{previewData.personalDetails?.phoneNumber || '+123-456-7890'}</p>
                  <p>{previewData.personalDetails?.email || 'your.email@example.com'}</p>
                  <p>{previewData.personalDetails?.githubUrl || 'github.com/yourusername'}</p>
                  <p>{previewData.personalDetails?.linkedinUrl || 'linkedin.com/in/yourusername'}</p>
                </div>
              </div>

              {/* Profile Section */}
              <div className="resume-section">
                <h3>Profile</h3>
                <p>
                  {previewData.profileSummary?.description ||
                    'Dynamic and creative Software developer with a degree in Mechatronics Engineering. Eager to leverage my technical expertise, programming skills and creative problemsolving abilities in a challenging environment that fosters growth and innovation.'}
                </p>
              </div>

              {/* Education Section */}
              {previewData.academicDetails?.length > 0 && (
                <div className="resume-section">
                  <h3>Education</h3>
                  {previewData.academicDetails.map((academic, index) => (
                    <div key={index} className="resume-item">
                      <h4>{academic.institutionName || 'Bannari Amman Institute of Technology'}</h4>
                      <p>Year of Passing: {academic.yearOfPassing || '2025'}</p>
                      <p>Percentage: {academic.percentage || 'N/A'}%</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Skills Section */}
              {skills.length > 0 && (
                <div className="resume-section">
                  <h3>Skills</h3>
                  <ul>
                    {skills.map((skill, index) => (
                      <li key={index}>{skill}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Work Experience Section */}
              {(previewData.internship?.length > 0 || previewData.productDevelopment?.length > 0) && (
                <div className="resume-section">
                  <h3>Work Experience</h3>
                  {previewData.internship.map((internship, index) => (
                    <div key={index} className="resume-item">
                      <h4>{internship.companyName || 'Company'} - {internship.role || 'Role'}</h4>
                      <p>
                        {internship.startDate || 'N/A'} - {internship.endDate || 'Present'}
                      </p>
                      <ul>
                        <li>{internship.description || 'Contributed to company projects.'}</li>
                      </ul>
                    </div>
                  ))}
                </div>
              )}

              {/* Projects Section */}
              {previewData.projectDetails?.length > 0 && (
                <div className="resume-section">
                  <h3>Projects</h3>
                  {previewData.projectDetails.map((project, index) => (
                    <div key={index} className="resume-item">
                      <h4>{project.title || 'Untitled Project'}</h4>
                      <p>URL: {project.url || 'N/A'}</p>
                      <ul>
                        <li>{project.description || 'N/A'}</li>
                      </ul>
                    </div>
                  ))}
                </div>
              )}

              {/* Competitions Section */}
              {previewData.competitions?.length > 0 && (
                <div className="resume-section">
                  <h3>Competitions</h3>
                  {previewData.competitions.map((competition, index) => (
                    <div key={index} className="resume-item">
                      <h4>{competition.title || `Competition ${index + 1}`}</h4>
                      <p>Organizer: {competition.organizer || 'N/A'}</p>
                      <p>Winning Details: {competition.winningDetails || 'N/A'}</p>
                      <p>
                        {competition.startDate || 'N/A'} - {competition.endDate || 'N/A'}
                      </p>
                      <ul>
                        <li>{competition.description || 'Participated in a competition.'}</li>
                      </ul>
                    </div>
                  ))}
                </div>
              )}

              {/* Online Courses Section */}
              {previewData.onlineCourse?.length > 0 && (
                <div className="resume-section">
                  <h3>Online Courses</h3>
                  {previewData.onlineCourse.map((course, index) => (
                    <div key={index} className="resume-item">
                      <h4>{course.courseName || 'Untitled Course'}</h4>
                      <p>
                        {course.startDate || 'N/A'} - {course.endDate || 'N/A'}
                      </p>
                      <ul>
                        <li>{course.description || 'Completed an online course.'}</li>
                      </ul>
                    </div>
                  ))}
                </div>
              )}

              {/* Languages Section */}
              {languages.length > 0 && (
                <div className="resume-section">
                  <h3>Languages</h3>
                  <ul>
                    {languages.map((lang, index) => (
                      <li key={index}>{lang} </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDetailsMentor;