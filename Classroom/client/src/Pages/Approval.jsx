import React, { useState, useEffect, useCallback } from 'react';
import MentorNav from '../Components/MentorNav';
const BaseUrl = import.meta.env.VITE_SERVER_APP_URL;

const styles = `
  /* single consolidated page-container */
  .page-container {
    background-color: transparent; /* body already has background */
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    position: relative;
    margin-top: 0; /* remove extra top margin that caused gaps */
  }
.page-container {
  margin-top: 60px;
}
  .card-container {
    background-color: #fff;
    border-radius: 1rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    padding: 20px;
    width: 90%;
    max-width: 700px;
  }

  .leave-table {
    width: 80%;           /* reduced width */
    max-width: 700px;     /* max width */
    margin: 0 auto;       /* center horizontally */
    border-collapse: collapse;
    margin-top: 20px;
  }

  .leave-table th,
  .leave-table td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: center;
  }

  .leave-table th {
    background-color: #f2f2f2;
    font-weight: bold;
  }

  .leave-table td {
    vertical-align: middle;
  }

  .accept-btn {
    background-color: #4CAF50;
    color: white;
    padding: 5px 12px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    margin-right: 8px;
    font-weight: bold;
  }

  .accept-btn:disabled {
    background-color: #a5d6a7;
    cursor: not-allowed;
  }

  .decline-btn {
    background-color: #f44336;
    color: white;
    padding: 5px 12px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-weight: bold;
  }

  .decline-btn:disabled {
    background-color: #ef9a9a;
    cursor: not-allowed;
  }

  .action-buttons {
    display: flex;
    gap: 5px;
    justify-content: center;
  }

  .second-nav {
    margin-bottom: 20px;
  }

  .leave-details {
    text-align: left;
  }
`;

const Approval = () => {
  const [leaveData, setLeaveData] = useState([]);

  // Custom sorting: Pending > Approved > Declined
  const sortLeaves = useCallback((leaves) => {
    const statusOrder = { Pending: 0, Approved: 1, Declined: 2 };
    return leaves.sort((a, b) => {
      const statusA = a.status || 'Pending';
      const statusB = b.status || 'Pending';
      return (statusOrder[statusA] ?? 3) - (statusOrder[statusB] ?? 3);
    });
  }, []);

  const fetchLeaveData = useCallback(async () => {
    try {
  const response = await fetch(`${BaseUrl}/api/approval`);
      if (!response.ok) throw new Error('Failed to fetch leave data');
      const data = await response.json();
      const sortedData = sortLeaves(data);
      setLeaveData(sortedData);
    } catch (error) {
      console.error('Error fetching leave data:', error);
    }
  }, [sortLeaves]);

  useEffect(() => {
    fetchLeaveData();
  }, [fetchLeaveData]);

  const handleStatusUpdate = async (id, status) => {
    try {
      const response = await fetch(`${BaseUrl}/api/approval/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) throw new Error('Failed to update leave status');
      const updatedLeave = await response.json();

      setLeaveData((prev) => {
        const updated = prev.map((leave) =>
          leave._id === updatedLeave._id ? updatedLeave : leave
        );
        return sortLeaves(updated);
      });
    } catch (error) {
      console.error('Error updating leave status:', error);
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="page-container">
        <div className="card-container">
          <div className="second-nav">
            <MentorNav />
          </div>

          <table className="leave-table">
            <thead>
              <tr>
                <th>Leave Details</th> {/* Combined Email, Type, From, To, Purpose */}
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {leaveData.length > 0 ? (
                leaveData.map((leave, index) => (
                  <tr key={index}>
                    <td className="leave-details">
                      <div><strong>Email:</strong> {leave.email}</div>
                      <div><strong>Type:</strong> {leave.leaveType}</div>
                      <div><strong>From:</strong> {new Date(leave.fromDateTime).toLocaleString()}</div>
                      <div><strong>To:</strong> {new Date(leave.toDateTime).toLocaleString()}</div>
                      <div><strong>Purpose:</strong> {leave.purpose}</div>
                    </td>
                    <td>{leave.status || 'Pending'}</td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="accept-btn"
                          onClick={() => {
                            if (window.confirm("Are you sure you want to accept this leave?")) {
                              handleStatusUpdate(leave._id, 'Approved');
                            }
                          }}
                          disabled={leave.status === 'Approved'}
                        >
                          Accept
                        </button>
                        <button
                          className="decline-btn"
                          onClick={() => {
                            if (window.confirm("Are you sure you want to decline this leave?")) {
                              handleStatusUpdate(leave._id, 'Declined');
                            }
                          }}
                          disabled={leave.status === 'Declined'}
                        >
                          Decline
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" style={{ textAlign: 'center' }}>
                    No leave applications found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Approval;
