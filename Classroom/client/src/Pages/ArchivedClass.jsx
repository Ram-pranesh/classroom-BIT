import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Archive, Trash2, MoreVertical, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { classGet, classPost } from '../services/Endpoint';

// Inline CSS for the Archived page
const styles = `
  /* Ensure global background color */
  :root, html, body, #root {
    background-color: #f5f5f5 !important;
  }

  /* Main Container */
  .archived-page {
    min-height: 100vh;
    background-color: #f5f5f5 !important;
    flex: 1;
    padding-top: 70px;
    padding-left: 80px;
  }

  /* Grid for Cards */
  .class-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 2rem;
    padding: 2rem;
    justify-items: center;
  }

  /* Class Card */
  .class-card {
    position: relative;
    width: 100%;
    max-width: 300px;
    height: 200px;
    border-radius: 1rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    padding: 1rem;
    color: #fff;
    transition: transform 0.2s, box-shadow 0.2s;
    cursor: pointer;
    background-image: linear-gradient(
      45deg,
      rgba(255, 255, 255, 0.2) 25%,
      transparent 25%,
      transparent 50%,
      rgba(255, 255, 255, 0.2) 50%,
      rgba(255, 255, 255, 0.2) 75%,
      transparent 75%,
      transparent
    );
    background-size: 20px 20px;
  }

  .class-card:hover {
    transform: scale(1.05);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
  }

  .class-initial {
    font-size: 3rem;
    font-weight: 700;
    line-height: 1;
    margin-bottom: 0.5rem;
    text-align: left;
  }

  .class-name {
    font-size: 1.25rem;
    font-weight: 600;
    text-align: left;
  }

  /* More Icon (Three Dots) */
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

  /* Dropdown Menu for More Options */
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

  .more-menu-item.unarchive {
    color: #6b48ff;
  }

  .more-menu-item.delete {
    color: #ff4d4f;
  }

  /* Confirmation Modal */
  .modal-overlay {
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

  .modal-content {
    background-color: #fff;
    border-radius: 1rem;
    padding: 2rem;
    width: 100%;
    max-width: 400px;
    text-align: center;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  }

  .modal-icon {
    margin-bottom: 1rem;
  }

  .modal-text {
    font-size: 1.25rem;
    font-weight: 500;
    color: #333;
    margin-bottom: 1.5rem;
  }

  .modal-buttons {
    display: flex;
    gap: 1rem;
    justify-content: center;
  }

  .modal-button {
    padding: 0.75rem 1.5rem;
    border-radius: 0.5rem;
    font-size: 1rem;
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
    background-color: #6b48ff;
    color: #fff;
  }

  .modal-button.confirm:hover {
    background-color: #5a3de6;
    transform: scale(1.02);
  }

  .modal-button.confirm-delete {
    background-color: #ff4d4f;
    color: #fff;
  }

  .modal-button.confirm-delete:hover {
    background-color: #e63946;
    transform: scale(1.02);
  }

  /* No Classes Message */
  .no-classes {
    text-align: center;
    color: #6b7280;
    font-size: 1.5rem;
    margin: 2rem 0;
  }

  /* Loading Spinner */
  .spinner {
    width: 2.5rem;
    height: 2.5rem;
    border: 4px solid #6b48ff;
    border-top: 4px solid transparent;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const ArchivedClass = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const { archivedClasses: contextArchivedClasses, getClass } = useOutletContext();
  const [archivedClasses, setArchivedClasses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showUnarchiveModal, setShowUnarchiveModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [classToUnarchive, setClassToUnarchive] = useState(null);
  const [classToDelete, setClassToDelete] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);
  const menuRefs = useRef({});

  const colors = [
    '#FF6F61', '#6B48FF', '#4CAF50', '#FFCA28', '#1E88E5',
    '#009688', '#795548', '#FF9800', '#3F51B5'
  ];

  const fetchArchivedClasses = async () => {
    setIsLoading(true);
    try {
      console.log('Fetching archived classes, user:', user);
      if (user?.role !== 'admin') {
        console.log('User is not an admin, redirecting to /home');
        navigate('/home');
        return;
      }

      if (contextArchivedClasses && contextArchivedClasses.length > 0) {
        console.log('Using archived classes from context:', contextArchivedClasses);
        setArchivedClasses(contextArchivedClasses);
      } else {
        console.log('Fetching archived classes from API');
        const response = await classGet('/class/getarchived');
        console.log('API Response from /class/getarchived:', response.data);
        if (response.data.success) {
          const sortedClasses = response.data.archivedClasses.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );
          setArchivedClasses(sortedClasses);
        } else {
          setArchivedClasses([]);
          toast.error(response.data.message || 'No archived classes found');
        }
      }
    } catch (error) {
      setArchivedClasses([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnarchive = async () => {
    if (!classToUnarchive) return;
    try {
      setIsLoading(true);
      const response = await classPost(`/class/unarchiveclass/${classToUnarchive._id}`, {});
      console.log('Unarchive response:', response.data);
      if (response.data.success) {
        setArchivedClasses(archivedClasses.filter((cls) => cls._id !== classToUnarchive._id));
        toast.success('Class unarchived successfully');
        if (getClass) {
          await getClass();
        }
      } else {
        toast.error(response.data.message || 'Failed to unarchive class');
      }
    } catch (error) {
      console.error('Error unarchiving class:', error);
      toast.error('Failed to unarchive class');
    } finally {
      setShowUnarchiveModal(false);
      setClassToUnarchive(null);
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!classToDelete || !classToDelete._id) return;
    try {
      setIsLoading(true);
      const response = await classPost(`/class/deleteclass/${classToDelete._id}`, {});
      if (response.data.success) {
        setArchivedClasses(archivedClasses.filter((cls) => cls._id !== classToDelete._id));
        toast.success("Class deleted successfully");
        if (getClass) {
          await getClass();
        }
      } else {
        toast.error(response.data.message || "Failed to delete class");
      }
    } catch (error) {
      console.error("Error deleting class:", error);
      toast.error("Failed to delete class");
    } finally {
      setShowDeleteModal(false);
      setClassToDelete(null);
      setIsLoading(false);
    }
  };

  const handleClassClick = (classId) => {
    if (!user) {
      console.error('User not found, redirecting to login');
      navigate('/');
      return;
    }
    navigate(`/admin/classadmin/${classId}`);
  };

  const toggleMoreMenu = (classId) => {
    setOpenMenuId(openMenuId === classId ? null : classId);
  };

  useEffect(() => {
    // console.log('useEffect triggered, user:', user);
    if (!user) {
      console.log('No user found, redirecting to login');
      navigate('/');
      return;
    }
    fetchArchivedClasses();
  }, [user, navigate, contextArchivedClasses]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (openMenuId && menuRefs.current[openMenuId] && !menuRefs.current[openMenuId].contains(event.target)) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openMenuId]);

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
      <div className="archived-page">
        <div className="class-grid">
          {archivedClasses.length > 0 ? (
            archivedClasses.map((cls, index) => {
              const color = colors[index % colors.length];
              const initial = cls.ClassName.charAt(0).toUpperCase();
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
                  <div className="class-initial">{initial}</div>
                  <div className="class-name">{cls.ClassName}</div>
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
                        className="more-menu-item unarchive"
                        onClick={(e) => {
                          e.stopPropagation();
                          setClassToUnarchive(cls);
                          setShowUnarchiveModal(true);
                          setOpenMenuId(null);
                        }}
                      >
                        <Archive size={16} />
                        Unarchive
                      </button>
                      <button
                        className="more-menu-item delete"
                        onClick={(e) => {
                          e.stopPropagation();
                          setClassToDelete(cls);
                          setShowDeleteModal(true);
                          setOpenMenuId(null);
                        }}
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <p className="no-classes">No archived classes found.</p>
          )}
        </div>

        {/* Unarchive Confirmation Modal */}
        {showUnarchiveModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <Archive size={40} className="modal-icon" />
              <p className="modal-text">Are you sure you want to unarchive this classroom?</p>
              <div className="modal-buttons">
                <button
                  className="modal-button cancel"
                  onClick={() => {
                    setShowUnarchiveModal(false);
                    setClassToUnarchive(null);
                  }}
                >
                  No, Cancel
                </button>
                <button className="modal-button confirm" onClick={handleUnarchive}>
                  Yes, Unarchive
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <Trash2 size={40} className="modal-icon" style={{ color: '#ff4d4f' }} />
              <p className="modal-text">Are you sure you want to delete this classroom?</p>
              <div className="modal-buttons">
                <button
                  className="modal-button cancel"
                  onClick={() => {
                    setShowDeleteModal(false);
                    setClassToDelete(null);
                  }}
                >
                  No, Cancel
                </button>
                <button className="modal-button confirm-delete" onClick={handleDelete}>
                  Yes, Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ArchivedClass;