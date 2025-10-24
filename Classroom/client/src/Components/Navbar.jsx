import React, { useState, useRef, useEffect } from 'react';
import { Plus, X, AlignJustify, Home, Archive, Users, UserCheck, Settings, GraduationCap } from 'lucide-react';
import toast from 'react-hot-toast';
import { classPost, post } from '../services/Endpoint';
import { RemoveUser } from '../redux/AuthSlice';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useSidebar } from '../context/SidebarContext';

// Updated CSS styles
const styles = `
  /* prevent unwanted horizontal scroll when popovers extend beyond viewport */
  html, body { overflow-x: hidden; }

  /* Navbar */
  .navbar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    background-color: #fff;
    backdrop-blur-lg;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    z-index: 20;
    display: flex;
    align-items: center;
    padding: 1rem 1rem;
    height: 64px;
    transition: left 0.3s ease-in-out;
    /* allow popovers/dropdowns to escape the navbar container */
    overflow: visible;
  }

  @media (min-width: 768px) {
    .navbar {
      left: 80px;
    }
    .navbar.sidebar-hovered {
      left: 256px;
    }
  }

  .navbar-logo {
    height: 40px;
    width: auto;
    filter: brightness-125 contrast-100;
  }

  .navbar-title {
    font-size: 1.25rem;
    font-weight: 700;
    background: linear-gradient(to right, #3b82f6, #2563eb);
    -webkit-background-clip: text;
    background-clip: text;
    color:  #6b48ff;
    margin-left: 0.75rem;
    display: none;
  }

  @media (min-width: 768px) {
    .navbar-title {
      display: inline;
    }
  }

  .navbar-right {
    margin-left: auto;
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .add-classroom-button {
    padding: 0.625rem;
    border-radius: 9999px;
    color: #3b82f6;
    transition: all 0.2s ease-in-out;
    position: relative;
  }

  .add-classroom-button:hover {
    background-color: rgba(59, 130, 246, 0.1);
    color: #2563eb;
    cursor: pointer;
  }

  /* Tooltip for Add Classroom Button - render below trigger */
  .add-classroom-button::before {
    content: attr(data-tooltip);
    position: absolute;
    top: calc(100% + 6px); /* place below element */
    left: 50%;
    transform: translateX(-50%);
    background-color: #333;
    color: #fff;
    padding: 5px 10px;
    border-radius: 5px;
    font-size: 0.75rem;
    font-weight: 400;
    white-space: nowrap;
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.2s ease-in-out, transform 0.12s;
    z-index: 9999;
    margin-top: 5px;
    pointer-events: none;
  }

  .add-classroom-button::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border-width: 5px;
    border-style: solid;
    border-color: transparent transparent #333 transparent; /* arrow pointing up to tooltip */
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.2s ease-in-out;
    z-index: 9999;
    pointer-events: none;
  }

  .add-classroom-button:hover::before,
  .add-classroom-button:hover::after {
    opacity: 1;
    visibility: visible;
  }

  .profile-container {
    position: relative;
    display: flex;
    align-items: center;
  }

  .profile-wrapper {
    cursor: pointer;
    position: relative;
  }

  .profile-image {
    width: 40px;
    height: 40px;
    border-radius: 9999px;
    border: 2px solid rgba(59, 130, 246, 0.3);
    object-fit: cover;
    transition: all 0.2s ease-in-out;
  }

  .profile-image:hover {
    border-color: rgba(59, 130, 246, 0.6);
  }

  .profile-placeholder {
    width: 40px;
    height: 40px;
    border-radius: 9999px;
    background-color: #e5e7eb;
    color: #374151;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.25rem;
    font-weight: 600;
    border: 2px solid rgba(59, 130, 246, 0.3);
    transition: all 0.2s ease-in-out;
  }

  .profile-placeholder:hover {
    border-color: rgba(59, 130, 246, 0.6);
  }

  /* Tooltip for Profile - render below trigger */
  .profile-wrapper::before {
    content: attr(data-tooltip);
    position: absolute;
    top: calc(100% + 6px);
    left: 50%;
    transform: translateX(-50%);
    background-color: #333;
    color: #fff;
    padding: 5px 10px;
    border-radius: 5px;
    font-size: 0.75rem;
    font-weight: 400;
    white-space: nowrap;
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.2s ease-in-out, transform 0.12s;
    z-index: 9999;
    margin-top: 5px;
    pointer-events: none;
  }

  .profile-wrapper::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border-width: 5px;
    border-style: solid;
    border-color: transparent transparent #333 transparent;
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.2s ease-in-out;
    z-index: 9999;
    pointer-events: none;
  }

  .profile-wrapper:hover::before,
  .profile-wrapper:hover::after {
    opacity: 1;
    visibility: visible;
  }

  .profile-input {
    display: none;
  }

  .profile-role {
    margin-left: 0.5rem;
    font-size: 0.875rem;
    font-weight: 500;
    color: #374151;
    display: none;
  }

  @media (min-width: 768px) {
    .profile-role {
      display: inline;
    }
  }

  /* Dropdown Menu */
  .dropdown-menu {
    position: absolute;
    top: 100%;
    right: 0;
    background-color: #fff;
    border-radius: 0.75rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    border: 1px solid #e5e7eb;
    width: 14rem;
    padding: 0.5rem 0;
    /* ensure dropdown is above navbar / overlays */
    z-index: 9999;
    opacity: 0;
    transform: translateY(-10px);
    transition: all 0.3s ease-in-out;
  }

  .dropdown-menu.open {
    opacity: 1;
    transform: translateY(0);
  }

  .dropdown-item {
    width: 100%;
    padding: 0.625rem 1rem;
    font-size: 0.875rem;
    font-weight: 500;
    color: #374151;
    background: none;
    border: none;
    text-align: left;
    transition: all 0.2s ease-in-out;
    display: flex;
    align-items: center;
    position: relative;
  }

  .dropdown-item:hover {
    background-color: #f3f4f6;
    cursor: pointer;
  }

  /* Tooltip for Dropdown Items (keeps original right-side behavior) */
  .dropdown-item::before {
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
    z-index: 9999;
    margin-left: 10px;
    pointer-events: none;
  }

  .dropdown-item::after {
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
    z-index: 9999;
    pointer-events: none;
  }

  .dropdown-item:hover::before,
  .dropdown-item:hover::after {
    opacity: 1;
    visibility: visible;
  }

  .dropdown-user-info {
    padding: 0.75rem 1rem;
    border-bottom: 1px solid #e5e7eb;
  }

  .dropdown-user-email {
    font-size: 0.875rem;
    font-weight: 500;
    color: #374151;
    margin-bottom: 0.25rem;
  }

  .dropdown-user-role {
    font-size: 0.75rem;
    font-weight: 500;
    color: #3b82f6;
  }

  /* Popup (Add Classroom) */
  .popup-container {
    position: fixed;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.5);
    backdrop-blur-sm;
    z-index: 40;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .popup {
    background-color: #fff;
    border-radius: 0.75rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    padding: 1.5rem;
    width: 100%;
    max-width: 28rem;
    position: relative;
    transform: scale(0.95);
    transition: transform 0.2s ease-in-out;
  }

  .popup-container .popup {
    transform: scale(1);
  }

  .close-button {
    position: absolute;
    top: 0.75rem;
    right: 0.75rem;
    padding: 0.25rem;
    border-radius: 9999px;
    color: #374151;
    transition: all 0.2s ease-in-out;
    position: relative;
  }

  .close-button:hover {
    background-color: #e5e7eb;
    cursor: pointer;
  }

  /* Tooltip for Close Button - render below trigger */
  .close-button::before {
    content: attr(data-tooltip);
    position: absolute;
    top: calc(100% + 6px);
    left: 50%;
    transform: translateX(-50%);
    background-color: #333;
    color: #fff;
    padding: 5px 10px;
    border-radius: 5px;
    font-size: 0.75rem;
    font-weight: 400;
    white-space: nowrap;
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.2s ease-in-out, transform 0.12s;
    z-index: 9999;
    margin-top: 5px;
    pointer-events: none;
  }

  .close-button::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border-width: 5px;
    border-style: solid;
    border-color: transparent transparent #333 transparent;
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.2s ease-in-out;
    z-index: 9999;
    pointer-events: none;
  }

  .close-button:hover::before,
  .close-button:hover::after {
    opacity: 1;
    visibility: visible;
  }

  .popup-title {
    font-size: 1.25rem;
    font-weight: 700;
    color: #111827;
    margin-bottom: 1rem;
    text-align: left;
  }

  .popup-input {
    width: 100%;
    padding: 0.625rem 1rem;
    background-color: #fff;
    border: 1px solid #d1d5db;
    border-radius: 0.5rem;
    font-size: 0.875rem;
    color: #374151;
    transition: all 0.2s ease-in-out;
  }

  .popup-input:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
  }

  .popup-button {
    width: 100%;
    padding: 0.625rem;
    background-color: #3b82f6;
    color: #fff;
    border: none;
    border-radius: 0.5rem;
    font-size: 0.875rem;
    font-weight: 600;
    transition: all 0.2s ease-in-out;
    position: relative;
  }

  .popup-button:hover {
    background-color: #2563eb;
    cursor: pointer;
  }

  /* Tooltip for Popup Button - render below trigger */
  .popup-button::before {
    content: attr(data-tooltip);
    position: absolute;
    top: calc(100% + 6px);
    left: 50%;
    transform: translateX(-50%);
    background-color: #333;
    color: #fff;
    padding: 5px 10px;
    border-radius: 5px;
    font-size: 0.75rem;
    font-weight: 400;
    white-space: nowrap;
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.2s ease-in-out, transform 0.12s;
    z-index: 9999;
    margin-top: 5px;
    pointer-events: none;
  }

  .popup-button::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border-width: 5px;
    border-style: solid;
    border-color: transparent transparent #333 transparent;
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.2s ease-in-out;
    z-index: 9999;
    pointer-events: none;
  }

  .popup-button:hover::before,
  .popup-button:hover::after {
    opacity: 1;
    visibility: visible;
  }

  /* Loading Spinner */
  .spinner {
    width: 3rem;
    height: 3rem;
    border: 3px solid #3b82f6;
    border-top: 3px solid transparent;
    border-radius: 9999px;
    animation: spin 1s linear infinite;
    margin: auto;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  /* Mobile Sidebar (Integrated into Navbar) */
  .mobile-sidebar {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    background-color: #fff;
    backdrop-blur-lg;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease-in-out;
    z-index: 30;
    width: 0;
    transform: translateX(-100%);
    overflow: hidden;
  }

  .mobile-sidebar.open {
    width: 256px;
    transform: translateX(0);
  }

  /* Menu Button in Mobile Sidebar */
  .menu-button {
    padding: 1.25rem;
    display: flex;
    justify-content: center;
    transition: all 0.3s ease-in-out;
    position: relative;
  }

  .mobile-sidebar.open .menu-button {
    justify-content: flex-end;
  }

  /* Tooltip for Menu Button - render below trigger */
  .menu-button::before {
    content: attr(data-tooltip);
    position: absolute;
    top: calc(100% + 6px);
    left: 50%;
    transform: translateX(-50%);
    background-color: #333;
    color: #fff;
    padding: 5px 10px;
    border-radius: 5px;
    font-size: 0.75rem;
    font-weight: 400;
    white-space: nowrap;
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.2s ease-in-out, transform 0.12s;
    z-index: 9999;
    margin-top: 5px;
    pointer-events: none;
  }

  .menu-button::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border-width: 5px;
    border-style: solid;
    border-color: transparent transparent #333 transparent;
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.2s ease-in-out;
    z-index: 9999;
    pointer-events: none;
  }

  .menu-button:hover::before,
  .menu-button:hover::after {
    opacity: 1;
    visibility: visible;
  }

  .menu-icon {
    color: #374151;
    transition: all 0.3s ease-in-out;
  }

  .menu-button:hover .menu-icon {
    color: #3b82f6;
    cursor: pointer;
  }

  /* Animation for mobile menu icon */
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

  /* Classroom Name in Mobile Sidebar */
  .mobile-classroom-name {
    padding: 1rem 1.25rem;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #6b7280;
    font-size: 1rem;
    font-weight: 600;
    text-align: center;
  }

  .mobile-sidebar.open .mobile-classroom-name {
    justify-content: flex-start;
  }

  /* Horizontal Line in Mobile Sidebar */
  .mobile-horizontal-line {
    width: 80%;
    height: 1px;
    background-color: #e5e7eb;
    margin: 0 auto;
  }

  .mobile-nav-links {
    display: flex;
    flex-direction: column;
    padding: 1.5rem 0.75rem;
    gap: 0.5rem;
    height: calc(100vh - 120px);
    justify-content: space-between;
  }

  .mobile-nav-item {
    display: flex;
    align-items: center;
    width: 100%;
    padding: 0.75rem;
    color: #000000;
    border-radius: 0.5rem;
    transition: all 0.3s ease-in-out;
    position: relative;
  }

  .mobile-nav-item:hover {
    background-color: #f3f4f6;
    color: #000000;
    cursor: pointer;
  }

  .mobile-nav-item.active {
    background-color: #e5e7eb;
    color: #3b82f6;
    border-left: 4px solid #3b82f6;
  }

  /* Add bottom margin to the Settings tab in mobile view */
  .mobile-nav-item.settings {
    margin-bottom: 20px;
  }

  .mobile-nav-icon {
    flex-shrink: 0;
    width: 20px;
    height: 20px;
  }

  .mobile-nav-text {
    margin-left: 1rem;
    font-size: 0.875rem;
    font-weight: 500;
  }

  /* Tooltip for Mobile Nav Items (keeps original side behavior) */
  .mobile-nav-item::before {
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
    z-index: 9999;
    margin-left: 10px;
    pointer-events: none;
  }

  .mobile-nav-item::after {
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
    z-index: 9999;
    pointer-events: none;
  }

  .mobile-nav-item:hover::before,
  .mobile-nav-item:hover::after {
    opacity: 1;
    visibility: visible;
  }

  .mobile-menu-button {
    padding: 0.5rem;
    margin-right: 0.5rem;
    display: flex;
    align-items: center;
    position: relative;
  }

  .mobile-menu-icon {
    color: #374151;
    transition: all 0.2s ease-in-out;
  }

  .mobile-menu-button:hover .mobile-menu-icon {
    color: #3b82f6;
    cursor: pointer;
  }

  /* Tooltip for Mobile Menu Button - render below trigger */
  .mobile-menu-button::before {
    content: attr(data-tooltip);
    position: absolute;
    top: calc(100% + 6px);
    left: 50%;
    transform: translateX(-50%);
    background-color: #333;
    color: #fff;
    padding: 5px 10px;
    border-radius: 5px;
    font-size: 0.75rem;
    font-weight: 400;
    white-space: nowrap;
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.2s ease-in-out, transform 0.12s;
    z-index: 9999;
    margin-top: 5px;
    pointer-events: none;
  }

  .mobile-menu-button::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border-width: 5px;
    border-style: solid;
    border-color: transparent transparent #333 transparent;
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.2s ease-in-out;
    z-index: 9999;
    pointer-events: none;
  }

  .mobile-menu-button:hover::before,
  .mobile-menu-button:hover::after {
    opacity: 1;
    visibility: visible;
  }

  /* Mobile Backdrop */
  .mobile-backdrop {
    position: fixed;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.3);
    z-index: 20;
    display: none;
  }

  .mobile-backdrop.open {
    display: block;
  }
`;

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isMobileSidebarHovered, setIsMobileSidebarHovered] = useState(false);
  const [className, setClassName] = useState('');
  const [semester, setSemester] = useState('');
  const [year, setYear] = useState('');
  const userMenuRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const { isSidebarHovered } = useSidebar();

  const user = useSelector((state) => state.auth.user);
  const userRole = user?.role;
  const userName = user?.name || "User";
  const userEmail = user?.email || "user@example.com";
  const firstLetter = userName.charAt(0).toUpperCase();
  const classroomName = useSelector((state) => state.classroom?.name) || "Classroom";

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) {
        setIsMobileSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const openPopup = () => {
    setIsPopupOpen(true);
    setIsUserMenuOpen(false);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    setClassName('');
    setSemester('');
    setYear('');
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
    if (isPopupOpen) setIsPopupOpen(false);
  };

  const closeUserMenu = () => {
    setIsUserMenuOpen(false);
  };

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
    setIsMobileSidebarHovered(!isMobileSidebarOpen);
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
    }
  };

  const handleCreateClass = async () => {
    if (!className.trim()) {
      toast.error("Please enter a subject name");
      return;
    }

    if (!semester || !year) {
      toast.error("Please select both semester and year");
      return;
    }

    try {
      setIsLoading(true);
      const endpoint = location.pathname === "/admin/faculty" ? "/facultyclass/createclass" : "/class/createclass";
      const payload = {
        ClassName: className,
        semester,
        year,
        createdBy: userEmail,
      };

      console.log('Creating class:', { endpoint, payload });
      const response = await classPost(endpoint, payload);

      if (response.status === 201 && response.data.message.includes("created successfully")) {
        closePopup();
        setClassName('');
        setSemester('');
        setYear('');
        toast.success("Class created successfully");
        window.dispatchEvent(new Event(location.pathname === "/admin/faculty" ? "facultyClassCreated" : "classCreated"));
      } else {
        throw new Error("Unexpected response from server");
      }
    } catch (error) {
      console.error('Error creating class:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      const errorMessage = error.response?.data?.message || error.message || "Failed to create class. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await post(`/auth/logout`);
      if (response.status === 200) {
        navigate("/");
        dispatch(RemoveUser());
        toast.success("Logout Successfully");
      }
    } catch (error) {
      console.error('Logout error:', error);
      toast.error("Failed to logout. Please try again.");
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [userMenuRef]);

  useEffect(() => {
    const handleClassCreated = () => {
      // fetchClassrooms(); // <-- REMOVE THIS useEffect
    };

    window.addEventListener("classCreated", handleClassCreated);
    window.addEventListener("facultyClassCreated", handleClassCreated);

    return () => {
      window.removeEventListener("classCreated", handleClassCreated);
      window.removeEventListener("facultyClassCreated", handleClassCreated);
    };
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <>
      <style>{styles}</style>
      <nav className={`navbar ${isSidebarHovered ? 'sidebar-hovered' : ''}`}>
        <div className="flex items-center">
          {isMobile && (
            <div className="mobile-menu-button" data-tooltip={isMobileSidebarOpen ? "Close sidebar" : "Open sidebar"}>
              <button onClick={toggleMobileSidebar}>
                {isMobileSidebarOpen || isMobileSidebarHovered ? (
                  <X size={24} className={`mobile-menu-icon ${isMobileSidebarOpen || isMobileSidebarHovered ? 'menu-icon-open' : 'menu-icon-close'}`} />
                ) : (
                  <AlignJustify size={24} className={`mobile-menu-icon ${isMobileSidebarOpen || isMobileSidebarHovered ? 'menu-icon-open' : 'menu-icon-close'}`} />
                )}
              </button>
            </div>
          )}
          <img
            src="/logo2.png"
            alt="BIT Classroom Logo"
            className="navbar-logo"
          />
          <span className="navbar-title">BIT Classroom</span>
        </div>
        <div className="navbar-right" ref={userMenuRef}>
          {['admin', 'super admin'].includes(userRole) && (location.pathname === "/home" || location.pathname === "/admin/faculty") && (
            <button
              className="add-classroom-button"
              onClick={openPopup}
              data-tooltip="Add a new classroom"
            >
              <Plus size={20} />
            </button>
          )}
          <div className="profile-container">
            <div className="profile-wrapper" data-tooltip="View profile options">
              {profileImage ? (
                <img
                  src={profileImage}
                  alt="Profile"
                  className="profile-image"
                  onClick={toggleUserMenu}
                />
              ) : (
                <div className="profile-placeholder" onClick={toggleUserMenu}>
                  {firstLetter}
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                className="profile-input"
                onChange={handleImageUpload}
                id="profile-image-upload"
              />
            </div>
            <span className="profile-role">{userRole || "User"}</span>
            {isUserMenuOpen && (
              <div className={`dropdown-menu ${isUserMenuOpen ? 'open' : ''}`}>
                <div className="dropdown-user-info">
                  <p className="dropdown-user-email">{userEmail}</p>
                  <p className="dropdown-user-role">{userRole || "User"}</p>
                </div>
                <button
                  className="dropdown-item"
                  onClick={handleLogout}
                  data-tooltip="Log out of your account"
                >
                  Log Out
                </button>
                <button
                  className="dropdown-item"
                  onClick={() => {
                    closeUserMenu();
                  }}
                  data-tooltip="Update your profile"
                >
                  Update
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {isMobile && (
        <>
          <div className={`mobile-sidebar ${isMobileSidebarOpen ? 'open' : ''}`}>
            <div className="menu-button" data-tooltip={isMobileSidebarOpen ? "Close sidebar" : "Open sidebar"}>
              <button onClick={toggleMobileSidebar}>
                {isMobileSidebarOpen || isMobileSidebarHovered ? (
                  <X size={24} className={`menu-icon ${isMobileSidebarOpen || isMobileSidebarHovered ? 'menu-icon-open' : 'menu-icon-close'}`} />
                ) : (
                  <AlignJustify size={24} className={`menu-icon ${isMobileSidebarOpen || isMobileSidebarHovered ? 'menu-icon-open' : 'menu-icon-close'}`} />
                )}
              </button>
            </div>

            <div className="mobile-classroom-name">
              {classroomName}
            </div>
            <div className="mobile-horizontal-line"></div>

            <nav className="mobile-nav-links">
              <div className="top-links">
                <div
                  className={`mobile-nav-item ${window.location.pathname === "/home" ? "active" : ""}`}
                  onClick={() => {
                    navigate("/home");
                    setIsMobileSidebarOpen(false);
                  }}
                  data-tooltip="View all classrooms"
                >
                  <Home size={20} className="mobile-nav-icon" />
                  <span className="mobile-nav-text">Classroom</span>
                </div>
                {['admin', 'super admin'].includes(userRole) && (
                  <>
                    <div
                      className={`mobile-nav-item ${window.location.pathname === '/admin/students' ? 'active' : ''}`}
                      onClick={() => {
                        navigate('/admin/students');
                        setIsMobileSidebarOpen(false);
                      }}
                      data-tooltip="Manage student records"
                    >
                      <Users size={20} className="mobile-nav-icon" />
                      <span className="mobile-nav-text">Student</span>
                    </div>
                    <div
                      className={`mobile-nav-item ${window.location.pathname === '/admin/faculty' ? 'active' : ''}`}
                      onClick={() => {
                        navigate('/admin/faculty');
                        setIsMobileSidebarOpen(false);
                      }}
                      data-tooltip="Manage faculty members"
                    >
                      <GraduationCap size={20} className="mobile-nav-icon" />
                      <span className="mobile-nav-text">Faculty</span>
                    </div>
                    <div
                      className={`mobile-nav-item ${window.location.pathname === '/admin/mentor' ? 'active' : ''}`}
                      onClick={() => {
                        navigate('/admin/mentor');
                        setIsMobileSidebarOpen(false);
                      }}
                      data-tooltip="Manage mentors"
                    >
                      <UserCheck size={20} className="mobile-nav-icon" />
                      <span className="mobile-nav-text">Mentor</span>
                    </div>
                  </>
                )}
              </div>
              <div className="bottom-links">
                {['admin', 'super admin'].includes(userRole) && (
                  <div
                    className={`mobile-nav-item ${window.location.pathname === '/admin/archived' ? 'active' : ''}`}
                    onClick={() => {
                      navigate('/admin/archived');
                      setIsMobileSidebarOpen(false);
                    }}
                    data-tooltip="View archived classes"
                  >
                    <Archive size={20} className="mobile-nav-icon" />
                    <span className="mobile-nav-text">Archived Class</span>
                  </div>
                )}
                <div
                  className={`mobile-nav-item settings ${window.location.pathname === '/settings' ? 'active' : ''}`}
                  onClick={() => {
                    navigate('/settings');
                    setIsMobileSidebarOpen(false);
                  }}
                  data-tooltip="Adjust application settings"
                >
                  <Settings size={20} className="mobile-nav-icon" />
                  <span className="mobile-nav-text">Settings</span>
                </div>
              </div>
            </nav>
          </div>
          {isMobileSidebarOpen && (
            <div
              className={`mobile-backdrop ${isMobileSidebarOpen ? 'open' : ''}`}
              onClick={toggleMobileSidebar}
            />
          )}
        </>
      )}

      {isPopupOpen && (
        <div className="popup-container">
          <div className="popup">
            <button
              onClick={closePopup}
              className="close-button"
              data-tooltip="Close popup"
            >
              <X size={24} />
            </button>
            <h2 className="popup-title">Add Classroom</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject Name
              </label>
              <input
                id="class-name"
                type="text"
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                className="popup-input"
                placeholder="Enter subject name"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Semester
              </label>
              <select
                id="semester"
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                className="popup-input"
              >
                <option value="">Select semester</option>
                <option value="Odd">Odd</option>
                <option value="Even">Even</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Academic Year
              </label>
              <select
                id="year"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="popup-input"
              >
                <option value="">Select year</option>
                <option value="2019-20">2019-20</option>
                <option value="2020-21">2020-21</option>
                <option value="2021-22">2021-22</option>
                <option value="2022-23">2022-23</option>
                <option value="2024-25">2024-25</option>
                <option value="2025-26">2025-26</option>
                <option value="2026-27">2026-27</option>
              </select>
            </div>
            <button
              className="popup-button"
              onClick={handleCreateClass}
              data-tooltip="Create a new classroom"
            >
              Create
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;