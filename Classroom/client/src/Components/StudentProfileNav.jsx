import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const styles = `
  .page-container {
    background-color: #d3d8e0;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px 20px 20px;
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
    margin: 0 auto 1rem auto;
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

const StudentProfileNav = ({ classId }) => {
  // Remove or comment out the console.log
  // console.log("Class ID in StudentProfileNav:", classId);
  
  const location = useLocation();
  const currentPath = location.pathname.toLowerCase();
  
  // Get user role from Redux instead of localStorage for consistency
  const user = useSelector((state) => state.auth.user);
  const userRole = user?.role || 'user';
  
  const basePath = userRole === 'user' 
    ? '/home/student-profile' 
    : `/mentor/classadmin/${classId}/studentprofile`;

  return (
    <>
      <style>{styles}</style>
      <div className="nav-bar">
        <Link
          to={`${basePath}/leave`}
          className={`nav-tab ${currentPath.includes('/leave') ? 'active' : ''}`}
        >
          Leave Apply
        </Link>
        <Link
          to={`${basePath}/academic`}
          className={`nav-tab ${currentPath.includes('/academic') ? 'active' : ''}`}
        >
          Academic
        </Link>
        <Link
          to={`${basePath}/achievements`}
          className={`nav-tab ${currentPath.includes('/achievements') ? 'active' : ''}`}
        >
          Achievements
        </Link>
      </div>
    </>
  );
};

export default StudentProfileNav;