import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getUser, post, deleteRequest } from '../services/Endpoint';
import toast from 'react-hot-toast';
import { Edit, Trash2 } from 'lucide-react';

const styles = `
  .page-container {
    background-color: #d3d8e0;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    position: relative;
  }

  .card-container {
    background-color: #fff;
    border-radius: 1rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 900px;
    padding: 2rem;
    margin-top: 4rem;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .page-title {
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
    margin-bottom: 1.5rem;
    text-align: center;
  }

  .user-details-table {
    width: 100%;
    border-collapse: collapse;
    background-color: #fff;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .user-details-table thead {
    background-color: #59499c;
    color: #fff;
  }

  .user-details-table th {
    padding: 16px 20px;
    text-align: left;
    font-weight: 600;
    font-size: 14px;
    text-transform: uppercase;
    line-height: 1.5;
  }

  .user-details-table tbody tr:nth-child(odd) {
    background-color: #f6f1ff;
  }

  .user-details-table tbody tr:nth-child(even) {
    background-color: #fff;
  }

  .user-details-table td {
    padding: 16px 20px;
    font-size: 14px;
    color: #333;
    line-height: 1.5;
  }

  .action-buttons {
    display: flex;
    gap: 1rem;
  }

  .action-buttons button {
    border: none;
    cursor: pointer;
    transition: transform 0.2s, color 0.2s;
  }

  .edit-button {
    color: #6b48ff;
  }

  .edit-button:hover {
    color: #5a3de6;
    transform: scale(1.1);
  }

  .delete-button {
    color: #f44336;
  }

  .delete-button:hover {
    color: #d32f2f;
    transform: scale(1.1);
  }

  .pagination {
    display: flex;
    justify-content: center;
    gap: 1rem;
    margin-top: 1.5rem;
  }

  .pagination-button {
    padding: 0.5rem 1rem;
    background-color: #6b48ff;
    color: #fff;
    border: none;
    border-radius: 0.5rem;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.2s, transform 0.2s;
  }

  .pagination-button:disabled {
    background-color: #a3bffa;
    cursor: not-allowed;
  }

  .pagination-button:hover:not(:disabled) {
    background-color: #5a3de6;
    transform: scale(1.02);
  }

  .no-data {
    text-align: center;
    color: #666;
    font-size: 1.1rem;
    margin-top: 2rem;
  }

  .spinner {
    width: 4rem;
    height: 4rem;
    border: 4px solid #6b48ff;
    border-top: 4px solid transparent;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }

  .modal-content {
    background-color: #fff;
    padding: 2rem;
    border-radius: 1rem;
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.3);
    width: 90%;
    max-width: 400px;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .modal-content h3 {
    font-size: 1.5rem;
    font-weight: 600;
    color: #333;
    margin-bottom: 1rem;
    text-align: center;
  }

  .modal-content label {
    font-size: 1rem;
    font-weight: 500;
    color: #333;
  }

  .modal-content input,
  .modal-content select {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #d1d5db;
    border-radius: 0.5rem;
    font-size: 1rem;
    color: #333;
    box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  .modal-content input:focus,
  .modal-content select:focus {
    outline: none;
    border-color: #6b48ff;
    box-shadow: 0 0 0 3px rgba(107, 72, 255, 0.2);
  }

  .modal-buttons {
    display: flex;
    justify-content: space-between;
    margin-top: 1rem;
  }

  .modal-button {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 0.5rem;
    font-weight: 600;
    cursor: pointer;
  }

  .modal-button.confirm {
    background-color: #6b48ff;
    color: #fff;
  }

  .modal-button.confirm:hover {
    background-color: #5a3de6;
  }

  .modal-button.cancel {
    background-color: #e5e7eb;
    color: #333;
  }

  .modal-button.cancel:hover {
    background-color: #d1d5db;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  @media (max-width: 768px) {
    .card-container {
      padding: 1rem;
      margin-top: 0.5rem;
    }

    .page-title {
      font-size: 1.8rem;
    }

    .section-title {
      font-size: 1.2rem;
    }

    .user-details-table th,
    .user-details-table td {
      padding: 12px 15px;
      font-size: 12px;
    }

    .no-data {
      font-size: 1rem;
    }

    .pagination-button {
      padding: 0.5rem 0.75rem;
      font-size: 0.9rem;
    }
  }
`;

const UserDetails = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editRole, setEditRole] = useState('');
  const [editRegister, setEditRegister] = useState('');
  const user = useSelector((state) => state.auth.user);

  const usersPerPage = 8;

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await getUser();
        console.log('User Details Response:', response.data);
        setUsers(response.data.users || []);
      } catch (error) {
        console.error('Failed to fetch user details:', error);
        setError('Failed to load user details. Please try again later.');
        toast.error('Failed to load user details.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserDetails();
  }, []);

  const getNameFromEmail = (email) => {
    if (!email) return 'N/A';
    const namePart = email.split('@')[0];
    return namePart.charAt(0).toUpperCase() + namePart.slice(1).toLowerCase();
  };

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(users.length / usersPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setEditName(user.name || getNameFromEmail(user.email));
    setEditEmail(user.email);
    setEditRole(user.role);
    setEditRegister(user.register || '');
    setShowEditModal(true);
  };

  const handleDelete = (user) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const confirmEdit = async () => {
    try {
      const updatedUser = {
        name: editName,
        email: editEmail,
        role: editRole,
        Register: editRegister,
      };
      const response = await post(`/auth/edituser/${selectedUser.id}`, updatedUser);
      if (response.data.success) {
        setUsers(users.map(u => u.id === selectedUser.id ? { ...u, ...updatedUser } : u));
        toast.success('User updated successfully');
        setShowEditModal(false);
      } else {
        toast.error(response.data.message || 'Failed to update user');
      }
    } catch (error) {
      console.error('Edit user error:', error);
      toast.error('Failed to update user');
    }
  };

  const confirmDelete = async () => {
    try {
      const response = await deleteRequest(`/auth/deleteuser/${selectedUser.id}`);
      if (response.data.success) {
        setUsers(users.filter(u => u.id !== selectedUser.id));
        toast.success('User deleted successfully');
        setShowDeleteModal(false);
        if (currentUsers.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
      } else {
        toast.error(response.data.message || 'Failed to delete user');
      }
    } catch (error) {
      console.error('Delete user error:', error);
      toast.error('Failed to delete user');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center mt-10">{error}</div>;
  }

  return (
    <>
      <style>{styles}</style>
      <div className="page-container">
        <div className="card-container">
          <h1 className="page-title">User Details</h1>

          <div className="w-full">
            {users.length > 0 ? (
              <>
                <table className="user-details-table">
                  <thead>
                    <tr>
                      <th>S/No.</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      {['admin', 'super admin'].includes(user.role) && <th>Actions</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {currentUsers.map((userDetail, index) => (
                      <tr key={userDetail.id}>
                        <td>{indexOfFirstUser + index + 1}</td>
                        <td>{userDetail.name || getNameFromEmail(userDetail.email)}</td>
                        <td>{userDetail.email || 'N/A'}</td>
                        <td>{userDetail.role || 'N/A'}</td>
                        {['admin', 'super admin'].includes(user.role) && (
                          <td>
                            <div className="action-buttons">
                              <button
                                className="edit-button"
                                onClick={() => handleEdit(userDetail)}
                              >
                                <Edit size={20} />
                              </button>
                              <button
                                className="delete-button"
                                onClick={() => handleDelete(userDetail)}
                              >
                                <Trash2 size={20} />
                              </button>
                            </div>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="pagination">
                  <button
                    className="pagination-button"
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </button>
                  <span>
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    className="pagination-button"
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </button>
                </div>
              </>
            ) : (
              <div className="no-data">No user data available.</div>
            )}
          </div>
        </div>
      </div>

      {showEditModal && selectedUser && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Edit User</h3>
            <label>Email:</label>
            <input
              type="email"
              value={editEmail}
              onChange={(e) => setEditEmail(e.target.value)}
            />
            <label>Role:</label>
            <select
              value={editRole}
              onChange={(e) => setEditRole(e.target.value)}
            >
              <option value="admin">Admin</option>
              <option value="user">User</option>
              <option value="super admin">Super Admin</option>
            </select>
            <div className="modal-buttons">
              <button className="modal-button confirm" onClick={confirmEdit}>
                Save
              </button>
              <button className="modal-button cancel" onClick={() => setShowEditModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && selectedUser && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Confirm Delete</h3>
            <p>Are you sure you want to delete the user "{selectedUser.email}"?</p>
            <div className="modal-buttons">
              <button className="modal-button confirm" onClick={confirmDelete}>
                Yes
              </button>
              <button className="modal-button cancel" onClick={() => setShowDeleteModal(false)}>
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UserDetails;