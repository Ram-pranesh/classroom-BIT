import React from 'react';
import { useParams, useLocation, Outlet } from 'react-router-dom'; // Added Outlet import
import StudentProfileNav from '../Components/StudentProfileNav';

const styles = `
  /* Page Container */
  .page-container {
    background-color: #d3d8e0;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    position: relative;
  }

  /* Card Container for content and StudentProfileNav */
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

  /* Style for StudentProfileNav to merge with the top of the card */
  .second-nav {
    background-color: #fff;
    border-top-left-radius: 1rem;
    border-top-right-radius: 1rem;
    padding: 0rem 0;
    margin: 0 -2rem;
  }

  /* Heading */
  .class-name {
    font-size: 2.5rem;
    font-weight: 800;
    color: #6b48ff;
    margin-bottom: 1rem;
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
`;

const StudentProfile = () => {
  const { classId } = useParams();
  const location = useLocation();
  const currentPath = location.pathname.toLowerCase();
  const basePath = `/mentor/classadmin/${classId}/studentprofile`;

  let pageTitle = 'Leave Apply';
  if (currentPath === `${basePath}/academic`) {
    pageTitle = 'Academic';
  } else if (currentPath === `${basePath}/achievements`) {
    pageTitle = 'Achievements';
  }

  return (
    <>
      <style>{styles}</style>
      <div className="page-container">
        <div className="card-container">
          <div className="second-nav">
            <StudentProfileNav classId={classId} />
          </div>
          {/* <h2 className="class-name">{pageTitle}</h2> */}
          <Outlet /> {/* Added Outlet to render child routes */}
        </div>
      </div>
    </>
  );
};

export default StudentProfile;