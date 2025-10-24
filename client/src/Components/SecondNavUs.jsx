import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const styles = `
  /* Navigation Bar Styles */
  .page-container {
    background-color: #d3d8e0;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 70px 20px 20px; /* Reduced padding-top from 70px to 20px to move nav-bar upwards */
    position: relative;
  }
  .nav-bar {
    width: 100%;
    max-width: 700px;
    background-color: #ffffff;
    border-radius: 20px 20px 0px 0px;
    display: flex;
    justify-content: space-around;
    padding: 10px 0;
    margin: 0 auto 1rem auto; /* Center the nav-bar and add bottom margin */
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .nav-tab {
    flex: 1;
    text-align: center;
    padding: 10px 0;
    font-size: 1rem;
    font-weight: 600;
    color: #000000;
    text-decoration: none;
    transition: color 0.2s, border-bottom 0.2s;
  }

  .nav-tab.active {
    color: #6b48ff;
    border-bottom: 2px solid #6b48ff;
  }

  .nav-tab:hover {
    color: #6b48ff;
  }
`;


const SecondNavUs= ({ classId }) => {
  console.log("Class ID in SecondNavUs:", classId);
  const location = useLocation();
  const currentPath = location.pathname;
  const basePath = `/home/classstudents/${classId}`; // Base path for the "Attendance" tab

  return (
    <>
      <style>{styles}</style>
      <div className="nav-bar">
        <Link
          to={`/home/classstudents/${classId}`}
          className={`nav-tab ${currentPath === basePath ? 'active' : ''}`}
        >
          Attendance
        </Link>
        <Link
          to={`/home/classstudents/${classId}/classwork`}
          className={`nav-tab ${currentPath.includes('classwork') ? 'active' : ''}`}
        >
          Classwork
        </Link>
        <Link
          to={`/home/classstudents/${classId}/quiz`}
          className={`nav-tab ${currentPath.includes('quiz') ? 'active' : ''}`}
        >
          Quiz
        </Link>
      </div>
    </>
  );
};

export default SecondNavUs;