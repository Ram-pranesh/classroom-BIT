import React, { useState, useRef, useEffect } from 'react';
import { Home, Archive, AlignJustify, X, Users, UserCheck, Settings, GraduationCap, Info } from 'lucide-react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useSidebar } from '../context/SidebarContext';

const styles = `
  .sidebar {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    background-color: #fff;
    backdrop-blur-lg;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease-in-out;
    z-index: 30;
    width: 80px;
    overflow: hidden;
    display: none;
  }

  /* When the sidebar is explicitly opened, set width to expanded value so
     the Navbar (which reads context) can adjust reliably. */
  .sidebar.open {
    width: 256px;
  }

  @media (min-width: 768px) {
    .sidebar {
      display: block;
    }
    .sidebar:hover {
      width: 256px;
    }
  }

  .menu-button {
    padding: 1.25rem;
    display: flex;
    justify-content: center;
    transition: all 0.3s ease-in-out;
  }

  .sidebar.open .menu-button,
  .sidebar:hover .menu-button {
    justify-content: flex-end;
  }

  .menu-icon {
    color: #374151;
    transition: all 0.3s ease-in-out;
  }

  .menu-button:hover .menu-icon {
    color: #3b82f6;
    cursor: pointer;
  }

  .menu-icon-open {
    animation: rotateToCross 0.3s ease-in-out forwards;
  }

  .menu-icon-close {
    animation: rotateToHamburger 0.3s ease-in-out forwards;
  }

  @keyframes rotateToCross {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(90deg);
    }
  }

  @keyframes rotateToHamburger {
    0% {
      transform: rotate(90deg);
    }
    100% {
      transform: rotate(0deg);
    }
  }

  /* classroom title - hidden by default, shown when sidebar is open/expanded */
  .classroom-name {
    padding: 1rem 1.25rem;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #6b7280;
    font-size: 1rem;
    font-weight: 600;
    text-align: center;
    opacity: 0;
    transition: opacity 0.2s ease-in-out, justify-content 0.2s ease-in-out;
    white-space: nowrap;
  }

  .sidebar.open .classroom-name,
  .sidebar:hover .classroom-name,
  .sidebar.expanded .classroom-name {
    opacity: 1;
    justify-content: flex-start;
  }

  .horizontal-line {
    width: 80%;
    height: 1px;
    background-color: #e5e7eb;
    margin: 0 auto;
  }

  .nav-links {
    display: flex;
    flex-direction: column;
    padding: 1.5rem 0.75rem;
    gap: 0.5rem;
    height: calc(100vh - 120px);
    justify-content: space-between;
  }

  .nav-item {
    display: flex;
    align-items: center;
    width: 100%;
    padding: 0.75rem;
    color: #000000;
    border-radius: 0.5rem;
    transition: all 0.3s ease-in-out;
    position: relative;
  }

  .nav-item:hover {
    background-color: #f3f4f6;
    color: #000000;
    cursor: pointer;
  }

  .nav-item.active {
    background-color: #e5e7eb;
    color: #3b82f6;
    border-left: 4px solid #3b82f6;
  }

  .nav-item.settings {
    margin-bottom: -30px;
  }

  .nav-icon {
    flex-shrink: 0;
    width: 20px;
    height: 20px;
  }

  .nav-text {
    margin-left: 1rem;
    font-size: 0.875rem;
    font-weight: 500;
    opacity: 0;
    transition: opacity 0.3s ease-in-out;
  }

  .sidebar:hover .nav-text,
  .sidebar.open .nav-text {
    opacity: 1;
  }

  .nav-item::before {
    content: attr(data-tooltip);
    position: absolute;
    left: 100%;
    top: 50%;
    transform: translateY(-50%);
    background-color: #333;
    color: #fff;
    padding: 5px 10px;
    border-radius: 5px;
    font-size: 0.75rem;
    font-weight: 400;
    white-space: nowrap;
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.2s ease-in-out;
    z-index: 10;
    margin-left: 10px;
  }

  .nav-item::after {
    content: '';
    position: absolute;
    left: 100%;
    top: 50%;
    transform: translateY(-50%);
    border-width: 5px;
    border-style: solid;
    border-color: transparent #333 transparent transparent;
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.2s ease-in-out;
  }

  .nav-item:hover::before,
  .nav-item:hover::after {
    opacity: 1;
    visibility: visible;
  }

  .backdrop {
    position: fixed;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.3);
    z-index: 20;
    display: none;
  }

  @media (max-width: 767px) {
    .backdrop.open {
      display: block;
    }
  }
`;

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();
  const userMenuRef = useRef();
  const user = useSelector((state) => state.auth.user);
  const userRole = user?.role;
  const { setIsSidebarHovered } = useSidebar();
  const classroomName = useSelector((state) => state.classroom?.name) || "Classroom";
  const location = useLocation();
  const path = location.pathname.toLowerCase();

  // Mentor should be active for admin/mentor OR mentor/classadmin routes
  // but NOT when the route is a studentprofile subroute (avoid auto-select)
  const mentorActive =
    path.startsWith('/admin/mentor') ||
    (path.startsWith('/mentor/classadmin') && !path.includes('/studentprofile'));

  // Student should be active for admin students list OR any studentprofile subroute
  const studentActive =
    path.startsWith('/admin/students') || path.includes('/studentprofile');

  // For user role: Classroom should only be active if NOT on student-profile
  const isClassroomActive = () => {
    if (userRole === 'user') {
      // For users, classroom is active only if we're at /home exactly or on class-related routes
      // but NOT on student-profile
      return path === '/home' || 
             (path.startsWith('/home/classstudents') && !path.includes('/student-profile'));
    }
    // For admins, use the existing isActive logic
    return isActive('/home');
  };

  // For user role: Student section should be active when on student-profile routes
  const isStudentActive = () => {
    if (userRole === 'user') {
      return path.includes('/home/student-profile');
    }
    return studentActive;
  };

  // Keep the shared sidebar-hovered state in sync with local open/hover state.
  useEffect(() => {
    setIsSidebarHovered(Boolean(isOpen || isHovered));
    return () => {
      // Ensure we reset when component unmounts
      setIsSidebarHovered(false);
    };
  }, [isOpen, isHovered, setIsSidebarHovered]);

  const handleNavigation = (path, tooltip) => {
    console.log('Navigating to:', path, 'User:', { email: user?.email, role: userRole });
    navigate(path);
  };

  const toggleSidebar = () => {
    console.log('Toggling sidebar. Current isOpen:', isOpen);
    setIsOpen(prev => !prev);
    console.log('New isOpen:', !isOpen);
    // No direct call to setIsSidebarHovered here — useEffect will sync the context
  };

  const handleMouseEnter = () => {
    console.log('Mouse entered sidebar');
    setIsHovered(true);
    // setIsSidebarHovered(true); <-- handled by useEffect
  };

  const handleMouseLeave = () => {
    console.log('Mouse left sidebar');
    setIsHovered(false);
    // setIsSidebarHovered(false); <-- handled by useEffect
  };

  const handleClose = () => {
    console.log('Closing sidebar');
    setIsOpen(false);
    setIsHovered(false);
    setIsSidebarHovered(false); // Make sure context is updated
  };

  const normalize = (p = "") => p.replace(/\/+$/g, "").toLowerCase();
  const isActive = (base) => {
    const current = normalize(location.pathname);
    if (Array.isArray(base)) {
      return base.some((b) => current.startsWith(normalize(b)));
    }
    return current.startsWith(normalize(base));
  };

  return (
    <>
      <style>{styles}</style>
      <div
        className={`sidebar ${isOpen ? 'open' : ''} ${isHovered ? 'expanded' : ''}`}
        ref={userMenuRef}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="menu-button">
          <button onClick={() => {
            if (isOpen || isHovered) {
              handleClose();
            } else {
              toggleSidebar();
            }
          }}>
            {(isOpen || isHovered) ? (
              <X 
                size={24} 
                className={`menu-icon menu-icon-open`}
              />
            ) : (
              <AlignJustify 
                size={24} 
                className={`menu-icon menu-icon-close`}
              />
            )}
          </button>
        </div>

        {/* show classroom title only when expanded/open */}
        <div className="classroom-name">{classroomName}</div>

        <nav className="nav-links">
          <div className="top-links">
            <Link to="/home" className={`nav-item ${isClassroomActive() ? "active" : ""}`}>
              <Home size={20} className="nav-icon" />
              <span className="nav-text">Classroom</span>
            </Link>
            {['admin', 'super admin'].includes(userRole) && (
              <>
                <Link
                  to="/admin/students"
                  className={`nav-item ${studentActive ? "active" : ""}`}
                  data-tooltip="Students"
                >
                  <Users size={20} className="nav-icon" />
                  <span className="nav-text">Students</span>
                </Link>
                <Link to="/admin/faculty" className={`nav-item ${isActive("/admin/faculty") ? 'active' : ''}`} data-tooltip="Manage faculty members">
                  <GraduationCap size={20} className="nav-icon" />
                  <span className="nav-text">Faculty</span>
                </Link>
                <Link
                  to="/admin/mentor"
                  className={`nav-item ${mentorActive ? 'active' : ''}`}
                  data-tooltip="Manage mentors"
                >
                  <UserCheck size={20} className="nav-icon" />
                  <span className="nav-text">Mentor</span>
                </Link>
              </>
            )}
            {userRole === 'user' && (
              <Link
                to="/home/student-profile/leave"  // Add default sub-route
                className={`nav-item ${isStudentActive() ? 'active' : ''}`}
                data-tooltip="Student"
              >
                <Users size={20} className="nav-icon" />
                <span className="nav-text">Student</span>
              </Link>
            )}
          </div>
          <div className="bottom-links">
            {['admin', 'super admin'].includes(userRole) && (
              <Link to="/admin/archived" className={`nav-item ${isActive("/admin/archived") ? 'active' : ''}`} data-tooltip="View archived classes">
                <Archive size={20} className="nav-icon" />
                <span className="nav-text">Archived Class</span>
              </Link>
            )}
            {userRole === 'super admin' && (
              <Link to="/admin/userdetails" className={`nav-item ${isActive("/admin/userdetails") ? 'active' : ''}`} data-tooltip="View user details">
                <Info size={20} className="nav-icon" />
                <span className="nav-text">User Details</span>
              </Link>
            )}
            <Link to="/admin/setting" className={`nav-item settings ${isActive("/admin/setting") ? 'active' : ''}`} data-tooltip="Adjust application settings">
              <Settings size={20} className="nav-icon" />
              <span className="nav-text">Settings</span>
            </Link>
          </div>
        </nav>
      </div>

      {isOpen && (
        <div
          className={`backdrop ${isOpen ? 'open' : ''}`}
          onClick={toggleSidebar}
        />
      )}
    </>
  );
};

export default Sidebar;