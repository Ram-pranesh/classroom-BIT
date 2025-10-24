import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { classGet, classPost } from '../services/Endpoint';
import { Edit, Trash2, Archive, X, MoreVertical, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

const styles = `
  .home-container {
    min-height: 100vh;
    background-color: #f5f5f5;
    display: flex;
    flex-direction: column;
  }

  .content-area {
    flex: 1;
    padding-top: 70px;
    padding-left: 80px;
    transition: padding-left 0.3s ease;
  }

  .class-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.5rem;
    padding: 1rem;
    justify-items: center;
  }

  .class-card {
    position: relative;
    width: 100%;
    max-width: 300px;
    height: 220px;
    border-radius: 1rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 1rem;
    color: #fff;
    transition: transform 0.2s, box-shadow 0.2s;
    cursor: pointer;
  }

  .class-card:hover {
    transform: scale(1.05);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
  }

  .class-initial {
    font-size: 2.5rem;
    font-weight: 700;
    line-height: 1;
    margin-bottom: 0.5rem;
  }

  .class-allfiles {
    font-size: 2rem;
    font-weight: 600;
    word-wrap: break-word;
    text-align: center;
    margin-bottom: 0.25rem;
  }

  .class-name {
    font-size: 2rem;
    font-weight: 600;
    word-wrap: break-word;
    margin-bottom: 0.25rem;
  }

  .class-details {
    font-size: 1rem;
    font-weight: 500;
    opacity: 0.9;
    margin-bottom: 0.25rem;
  }

  .class-creator {
    font-size: 1rem;
    font-weight: 500;
    opacity: 0.8;
  }

  .more-icon {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    transition: transform 0.2s;
    cursor: pointer;
  }

  .more-icon:hover {
    transform: scale(1.1);
  }

  .more-menu {
    position: absolute;
    top: 2.5rem;
    right: 0.5rem;
    background-color: #fff;
    border-radius: 0.5rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    border: 1px solid #e5e7eb;
    width: 150px;
    z-index: 100;
    opacity: 0;
    transform: translateY(-10px);
    transition: all 0.3s ease-in-out;
  }

  .more-menu.open {
    opacity: 1;
    transform: translateY(0);
  }

  .more-menu-item {
    width: 100%;
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
    font-weight: 500;
    color: #374151;
    background: none;
    border: none;
    text-align: left;
    transition: all 0.2s ease-in-out;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
  }

  .more-menu-item:hover {
    background-color: #f3f4f6;
  }

  .more-menu-item.edit {
    color: #6b48ff;
  }

  .more-menu-item.archive {
    color: #6b48ff;
  }

  .more-menu-item.delete {
    color: #ff4d4f;
  }

  .modal-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 200;
  }

  .modal {
    background-color: #fff;
    border-radius: 1rem;
    padding: 1.5rem;
    width: 90%;
    max-width: 400px;
    text-align: center;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  }

  .modal-icon {
    margin-bottom: 1rem;
  }

  .modal-text {
    font-size: 1.1rem;
    font-weight: 500;
    color: #333;
    margin-bottom: 1rem;
  }

  .modal-buttons {
    display: flex;
    gap: 0.75rem;
    justify-content: center;
    flex-wrap: wrap;
  }

  .modal-button {
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    font-size: 0.9rem;
    font-weight: 600;
    transition: background-color 0.2s, transform 0.2s;
  }

  .modal-button.cancel {
    background-color: #e5e7eb;
    color: #333;
  }

  .modal-button.cancel:hover {
    background-color: #d1d5db;
    transform: scale(1.02);
  }

  .modal-button.confirm {
    background-color: #ff4d4f;
    color: #fff;
  }

  .modal-button.confirm:hover {
    background-color: #e63946;
    transform: scale(1.02);
  }

  .modal-button.confirm-archive {
    background-color: #6b48ff;
    color: #fff;
  }

  .modal-button.confirm-archive:hover {
    background-color: #5a3de6;
    transform: scale(1.02);
  }

  .modal-button.confirm-edit {
    background-color: #6b48ff;
    color: #fff;
  }

  .modal-button.confirm-edit:hover {
    background-color: #5a3de6;
    transform: scale(1.02);
  }

  .edit-modal {
    background-color: #fff;
    border-radius: 0.5rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    padding: 1.5rem;
    width: 90%;
    max-width: 400px;
    position: relative;
  }

  .close-button {
    position: absolute;
    top: 0.75rem;
    right: 0.75rem;
    padding: 0.25rem;
    border-radius: 50%;
    color: #6b48ff;
    transition: background-color 0.2s, transform 0.2s;
  }

  .close-button:hover {
    background-color: #f1f7ff;
    transform: scale(1.1);
    cursor: pointer;
  }

  .edit-modal-title {
    font-size: 1.25rem;
    font-weight: 700;
    color: #000;
    margin-bottom: 1rem;
    text-align: center;
  }

  .edit-modal-input, .edit-modal-select {
    width: 100%;
    padding: 0.5rem;
    background-color: #fff;
    border: 1px solid #d1d5db;
    border-radius: 0.5rem;
    font-size: 0.9rem;
    color: #333;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    transition: border-color 0.2s, box-shadow 0.2s;
    margin-bottom: 1rem;
  }

  .edit-modal-input:focus, .edit-modal-select:focus {
    outline: none;
    border-color: #6b48ff;
    box-shadow: 0 0 0 3px rgba(107, 72, 255, 0.2);
  }

  .edit-modal-button {
    width: 100%;
    padding: 0.5rem;
    background-color: #6b48ff;
    color: #fff;
    border: none;
    border-radius: 0.5rem;
    font-size: 0.9rem;
    font-weight: 600;
    transition: background-color 0.2s, transform 0.2s;
  }

  .edit-modal-button:hover {
    background-color: #5a3de6;
    transform: scale(1.02);
    cursor: pointer;
  }

  .no-classes {
    text-align: center;
    color: #6b7280;
    font-size: 1.25rem;
    margin: 1.5rem 0;
  }

  .spinner {
    width: 2rem;
    height: 2rem;
    border: 3px solid #6b48ff;
    border-top: 3px solid transparent;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  .back-button {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background-color: #6b48ff;
    color: #fff;
    border: none;
    border-radius: 0.5rem;
    cursor: pointer;
    transition: background-color 0.2s, transform 0.2s;
    margin-bottom: 1rem;
  }

  .back-button:hover {
    background-color: #5a3de6;
    transform: scale(1.02);
  }

  @media (max-width: 768px) {
    .home-container {
      flex-direction: column;
    }

    .content-area {
      padding-left: 0;
      padding-top: 60px;
    }

    .class-grid {
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 1rem;
      padding: 2rem 0.5rem 0.5rem;
    }

    .class-card {
      max-width: 100%;
      height: 180px;
    }

    .class-initial {
      font-size: 2rem;
    }

    .class-name {
      font-size: 1rem;
    }

    .class-details {
      font-size: 0.75rem;
    }

    .class-creator {
      font-size: 0.65rem;
    }

    .more-icon {
      padding: 0.3rem;
    }

    .modal {
      padding: 1rem;
      max-width: 90%;
    }

    .modal-text {
      font-size: 1rem;
    }

    .modal-button {
      padding: 0.5rem 0.75rem;
      font-size: 0.85rem;
    }

    .edit-modal {
      padding: 1rem;
    }

    .edit-modal-title {
      font-size: 1.1rem;
    }

    .edit-modal-input, .edit-modal-select {
      padding: 0.4rem;
      font-size: 0.85rem;
    }

    .edit-modal-button {
      padding: 0.4rem;
      font-size: 0.85rem;
    }

    .no-classes {
      font-size: 1rem;
    }

    .spinner {
      width: 1.5rem;
      height: 1.5rem;
    }

    .back-button {
      font-size: 0.85rem;
      padding: 0.4rem 0.75rem;
    }
  }

  @media (max-width: 480px) {
    .class-grid {
      grid-template-columns: 1fr;
      padding: 2.5rem 0.5rem 0.5rem;
    }

    .class-card {
      height: 160px;
    }

    .class-initial {
      font-size: 1.5rem;
    }

    .class-name {
      font-size: 0.9rem;
    }

    .class-details {
      font-size: 0.7rem;
    }

    .class-creator {
      font-size: 0.6rem;
    }
  }
`;

const Faculty = () => {
  const navigate = useNavigate();
  const [classes, setClasses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);
  const [isArchiveModalOpen, setIsArchiveModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isEditConfirmModalOpen, setIsEditConfirmModalOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [editClassName, setEditClassName] = useState('');
  const [editSemester, setEditSemester] = useState('');
  const [editYear, setEditYear] = useState('');
  const [openMenuId, setOpenMenuId] = useState(null);
  const [showOtherClasses, setShowOtherClasses] = useState(false);
  const menuRefs = useRef({});
  const user = useSelector((state) => state.auth.user);
  const colors = [
    '#FF6F61', '#6B48FF', '#4CAF50', '#FFCA28', '#1E88E5',
    '#009688', '#795548', '#FF9800', '#3F51B5'
  ];

  const semesterOptions = ['Odd', 'Even'];
  const yearOptions = ['2019-20', '2020-21', '2021-22', '2022-23', '2024-25', '2025-26', '2026-27'];

  const getUsernameFromEmail = (email) => {
    if (!email || !email.includes('@')) return email || 'Unknown';
    return email.split('@')[0];
  };

  const getClass = async () => {
    setIsLoading(true);
    try {
      console.log('Fetching all faculty classes:', { user: { email: user?.email, role: user?.role } });
      if (!user || !['admin', 'super admin', 'faculty'].includes(user.role)) {
        throw new Error('User is not authorized');
      }
      // Fetch all classes, not just those created by the user
      const response = await classGet(`/facultyclass/getallclasses`);
      const sortedClass = response.data.getclass.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setClasses(sortedClass);
    } catch (error) {
      console.error("Error fetching faculty classes:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      toast.error(error.response?.data?.message || "Failed to fetch classes");
      setClasses([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveClass = async () => {
    if (!selectedClass || !selectedClass._id) return;
    try {
      setIsLoading(true);
      const response = await classPost(`/facultyclass/deleteclass/${selectedClass._id}`, {});
      if (response.data.success) {
        setClasses(classes.filter(cls => cls._id !== selectedClass._id));
        toast.success("Class removed successfully");
      } else {
        toast.error(response.data.message || "Failed to remove class");
      }
    } catch (error) {
      console.error("Error removing faculty class:", error);
      toast.error("Failed to remove class");
    } finally {
      setIsRemoveModalOpen(false);
      setSelectedClass(null);
      setIsLoading(false);
    }
  };

  const handleArchiveClass = async () => {
    if (!selectedClass || !selectedClass._id) return;
    try {
      setIsLoading(true);
      const response = await classPost(`/facultyclass/archiveclass/${selectedClass._id}`, {});
      if (response.data.success) {
        setClasses(classes.filter(cls => cls._id !== selectedClass._id));
        toast.success("Class archived successfully");
      } else {
        toast.error(response.data.message || "Failed to archive class");
      }
    } catch (error) {
      console.error("Error archiving faculty class:", error);
      toast.error("Failed to archive class");
    } finally {
      setIsArchiveModalOpen(false);
      setSelectedClass(null);
      setIsLoading(false);
    }
  };

  const handleEditClass = async () => {
    if (!selectedClass || !selectedClass._id || !editClassName.trim() || !editSemester || !editYear) {
      toast.error("Subject name, semester, and year cannot be empty");
      setIsEditConfirmModalOpen(false);
      setIsEditModalOpen(true);
      return;
    }
    try {
      setIsLoading(true);
      const response = await classPost(`/facultyclass/updateclass/${selectedClass._id}`, {
        ClassName: editClassName,
        semester: editSemester,
        year: editYear,
      });
      if (response.data.success) {
        setClasses(classes.map(cls =>
          cls._id === selectedClass._id
            ? { ...cls, ClassName: editClassName, semester: editSemester, year: editYear }
            : cls
        ));
        toast.success("Class updated successfully");
      } else {
        toast.error(response.data.message || "Failed to update class");
      }
    } catch (error) {
      console.error("Error updating faculty class:", error);
      toast.error("Failed to update class");
    } finally {
      setIsEditConfirmModalOpen(false);
      setIsEditModalOpen(false);
      setSelectedClass(null);
      setEditClassName('');
      setEditSemester('');
      setEditYear('');
      setIsLoading(false);
    }
  };

  const handleClassClick = (classId) => {
    if (!user) {
      console.error("User not found!");
      navigate('/');
      return;
    }
    navigate(`/admin/faculty/class/${classId}`);
  };

  const toggleMoreMenu = (classId) => {
    setOpenMenuId(openMenuId === classId ? null : classId);
  };

  useEffect(() => {
    if (user) {
      getClass();
    } else {
      navigate('/');
    }
  }, [user, navigate]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (openMenuId && menuRefs.current[openMenuId] && !menuRefs.current[openMenuId].contains(event.target)) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openMenuId]);

  useEffect(() => {
    const handleClassCreated = () => getClass();
    window.addEventListener('facultyClassCreated', handleClassCreated);
    return () => window.removeEventListener('facultyClassCreated', handleClassCreated);
  }, []);

  const myClasses = classes.filter(cls => cls.createdBy === user.email);
  const otherClasses = classes.filter(cls => cls.createdBy !== user.email);

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
      <div className="home-container">
        <div className="content-area">
          {showOtherClasses ? (
            <>
              <button
                className="back-button"
                onClick={() => setShowOtherClasses(false)}
              >
                <ArrowLeft size={20} />
                Back to My Classes
              </button>
              <div className="class-grid">
                {otherClasses.length > 0 ? (
                  otherClasses.map((cls, index) => {
                    if (!cls || !cls._id || !cls.ClassName) return null;
                    const color = colors[index % colors.length];
                    return (
                      <div
                        key={cls._id}
                        className="class-card"
                        style={{ backgroundColor: color }}
                        onClick={() => handleClassClick(cls._id)}
                      >
                        <div className="class-name">{cls.ClassName}</div>
                        <div className="class-details">
                          {cls.semester} -Semester, {cls.year}
                        </div>
                        <div className="class-creator">Created By: {getUsernameFromEmail(cls.createdBy)}</div>
                      </div>
                    );
                  })
                ) : (
                  <p className="no-classes">No classes by other users.</p>
                )}
              </div>
            </>
          ) : (
            <div className="class-grid">
              {otherClasses.length > 0 && (
                <div
                  className="class-card"
                  style={{ backgroundColor: colors[0] }}
                  onClick={() => setShowOtherClasses(true)}
                >
                  <div className="class-allfiles">All Files</div>
                </div>
              )}

              {myClasses.length > 0 ? (
                myClasses.map((cls, index) => {
                  if (!cls || !cls._id || !cls.ClassName) return null;
                  const color = colors[(index + 1) % colors.length];
                  return (
                    <div
                      key={cls._id}
                      className="class-card"
                      style={{ backgroundColor: color }}
                      onClick={(e) => {
                        if (!e.target.closest('.more-icon') && !e.target.closest('.more-menu')) {
                          handleClassClick(cls._id);
                        }
                      }}
                    >
                      <div className="class-name">{cls.ClassName}</div>
                      <div className="class-details">
                        {cls.semester} -Semester, {cls.year}
                      </div>
                      <div className="class-creator">Created By: {getUsernameFromEmail(cls.createdBy)}</div>
                      {cls.createdBy === user.email && (
                        <>
                          <button
                            className="more-icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleMoreMenu(cls._id);
                            }}
                          >
                            <MoreVertical size={20} color="#fff" />
                          </button>
                          {openMenuId === cls._id && (
                            <div
                              className={`more-menu ${openMenuId === cls._id ? 'open' : ''}`}
                              ref={(el) => (menuRefs.current[cls._id] = el)}
                            >
                              <button
                                className="more-menu-item edit"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedClass(cls);
                                  setEditClassName(cls.ClassName);
                                  setEditSemester(cls.semester || '');
                                  setEditYear(cls.year || '');
                                  setIsEditModalOpen(true);
                                  setOpenMenuId(null);
                                }}
                              >
                                <Edit size={16} />
                                Edit
                              </button>
                              <button
                                className="more-menu-item delete"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedClass(cls);
                                  setIsRemoveModalOpen(true);
                                  setOpenMenuId(null);
                                }}
                              >
                                <Trash2 size={16} />
                                Delete
                              </button>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  );
                })
              ) : otherClasses.length === 0 ? (
                <p className="no-classes">No classes created by you.</p>
              ) : null}
            </div>
          )}
        </div>
      </div>

      {isRemoveModalOpen && (
        <div className="modal-container">
          <div className="modal">
            <Trash2 size={40} className="modal-icon" style={{ color: '#ff4d4f' }} />
            <p className="modal-text">Are you sure you want to remove this classroom?</p>
            <div className="modal-buttons">
              <button
                className="modal-button cancel"
                onClick={() => {
                  setIsRemoveModalOpen(false);
                  setSelectedClass(null);
                }}
              >
                Cancel
              </button>
              <button
                className="modal-button confirm"
                onClick={handleRemoveClass}
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}

      {isArchiveModalOpen && (
        <div className="modal-container">
          <div className="modal">
            <Archive size={40} className="modal-icon" style={{ color: '#6b48ff' }} />
            <p className="modal-text">Are you sure you want to archive this classroom?</p>
            <div className="modal-buttons">
              <button
                className="modal-button cancel"
                onClick={() => {
                  setIsArchiveModalOpen(false);
                  setSelectedClass(null);
                }}
              >
                Cancel
              </button>
              <button
                className="modal-button confirm-archive"
                onClick={handleArchiveClass}
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}

      {isEditModalOpen && (
        <div className="modal-container">
          <div className="edit-modal">
            <button
              onClick={() => {
                setIsEditModalOpen(false);
                setSelectedClass(null);
                setEditClassName('');
                setEditSemester('');
                setEditYear('');
              }}
              className="close-button"
            >
              <X size={24} />
            </button>
            <h2 className="edit-modal-title">Edit Classroom</h2>
            <div className="mb-4">
              <label className="block text-lg font-medium text-gray-700 mb-2">
                Subject Name
              </label>
              <input
                type="text"
                value={editClassName}
                onChange={(e) => setEditClassName(e.target.value)}
                className="edit-modal-input"
                placeholder="Enter new subject name"
              />
            </div>
            <div className="mb-4">
              <label className="block text-lg font-medium text-gray-700 mb-2">
                Semester
              </label>
              <select
                value={editSemester}
                onChange={(e) => setEditSemester(e.target.value)}
                className="edit-modal-select"
              >
                <option value="">Select semester</option>
                {semesterOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-lg font-medium text-gray-700 mb-2">
                Academic Year
              </label>
              <select
                value={editYear}
                onChange={(e) => setEditYear(e.target.value)}
                className="edit-modal-select"
              >
                <option value="">Select year</option>
                {yearOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
            <button
              className="edit-modal-button"
              onClick={() => {
                if (!editClassName.trim() || !editSemester || !editYear) {
                  toast.error("Subject name, semester, and year cannot be empty");
                  return;
                }
                setIsEditModalOpen(false);
                setIsEditConfirmModalOpen(true);
              }}
            >
              Save
            </button>
          </div>
        </div>
      )}

      {isEditConfirmModalOpen && (
        <div className="modal-container">
          <div className="modal">
            <p className="modal-text">Are you sure you want to save the changes?</p>
            <div className="modal-buttons">
              <button
                className="modal-button cancel"
                onClick={() => {
                  setIsEditConfirmModalOpen(false);
                  setIsEditModalOpen(true);
                }}
              >
                Cancel
              </button>
              <button
                className="modal-button confirm-edit"
                onClick={handleEditClass}
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Faculty;