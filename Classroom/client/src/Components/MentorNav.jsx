import React from 'react';
import { Link, useLocation } from 'react-router-dom';

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

const MentorNav = ({ classId }) => {
  console.log("Class ID in MentorNav:", classId);
  const location = useLocation();
  const currentPath = location.pathname.toLowerCase();
  const basePath = classId ? `/mentor/classadmin/${classId}` : '/mentor/classadmin/default';

  return (
    <>
      <style>{styles}</style>
      <div className="nav-bar">
        <Link
          to={`${basePath}/approval`}
          className={`nav-tab ${currentPath === `${basePath}/approval` ? 'active' : ''}`}
        >
          Approval
        </Link>
        <Link
          to={`${basePath}/studentdetail`}
          className={`nav-tab ${currentPath === `${basePath}/studentdetail` ? 'active' : ''}`}
        >
          Student Details
        </Link>
        <Link
          to={`${basePath}/report`}
          className={`nav-tab ${currentPath === `${basePath}/report` ? 'active' : ''}`}
        >
          Report
        </Link>
        <Link
          to={`${basePath}/addstudents`}
          className={`nav-tab ${currentPath === `${basePath}/addstudents` ? 'active' : ''}`}
        >
          Add Students
        </Link>
      </div>
    </>
  );
};

export default MentorNav;