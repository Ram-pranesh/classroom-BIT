import React, { useState, useEffect } from 'react';

const Leave = () => {
  const [email, setEmail] = useState('');
  const [leaveType, setLeaveType] = useState('');
  const [fromDateTime, setFromDateTime] = useState('');
  const [toDateTime, setToDateTime] = useState('');
  const [purpose, setPurpose] = useState('');
  const [leaves, setLeaves] = useState([]);

  useEffect(() => {
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0]; // YYYY-MM-DD
    setFromDateTime(`${dateStr}T08:30`);
    setToDateTime(`${dateStr}T16:30`);

    const storedEmail = localStorage.getItem('email');
    if (storedEmail) {
      setEmail(storedEmail);
      fetchUserLeaves(storedEmail);
    }
  }, []);

  const fetchUserLeaves = async (userEmail) => {
    try {
      const res = await fetch(`http://localhost:8000/api/leave?email=${userEmail}`);
      if (res.ok) {
        const data = await res.json();
        setLeaves(data);
      } else {
        console.error("Failed to fetch leave records");
      }
    } catch (error) {
      console.error("Error fetching leave records:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const leaveData = {
      email,
      leaveType,
      fromDateTime,
      toDateTime,
      purpose,
    };

    try {
      const response = await fetch('http://localhost:8000/api/leave', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(leaveData),
      });

      if (response.ok) {
        alert('Leave Request Submitted Successfully!');
        setLeaveType('');
        setPurpose('');
        fetchUserLeaves(email);
      } else {
        alert('Failed to submit leave request');
      }
    } catch (error) {
      console.error('Error submitting leave request:', error);
      alert('An error occurred while submitting leave request');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this leave request?')) return;
    try {
      const res = await fetch(`http://localhost:8000/api/leave/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setLeaves((prev) => prev.filter((leave) => leave._id !== id));
      } else {
        alert('Failed to delete leave request');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Error deleting leave request');
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.formContainer}>
        <h2 style={styles.heading}>Leave Application</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label}>Leave Type:</label>
          <select
            style={styles.input}
            value={leaveType}
            onChange={(e) => setLeaveType(e.target.value)}
            required
          >
            <option value="">Select Leave Type</option>
            <option value="Casual Leave">Casual Leave</option>
            <option value="Sick Leave">Sick Leave</option>
            <option value="Earned Leave">Earned Leave</option>
          </select>

          <label style={styles.label}>From Date & Time:</label>
          <input
            type="datetime-local"
            style={styles.input}
            value={fromDateTime}
            onChange={(e) => setFromDateTime(e.target.value)}
            required
          />

          <label style={styles.label}>To Date & Time:</label>
          <input
            type="datetime-local"
            style={styles.input}
            value={toDateTime}
            onChange={(e) => setToDateTime(e.target.value)}
            required
          />

          <label style={styles.label}>Purpose of Leave:</label>
          <textarea
            style={{ ...styles.input, height: '60px' }}
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            required
          ></textarea>

          <button type="submit" style={styles.button}>
            Submit Leave Request
          </button>
        </form>

        <h3 style={{ marginTop: '30px', textAlign: 'center' }}>Your Leave Requests</h3>
        <table style={{ width: '100%', marginTop: '10px', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={styles.th}>Type</th>
              <th style={styles.th}>From</th>
              <th style={styles.th}>To</th>
              <th style={styles.th}>Purpose</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Action</th>
            </tr>
          </thead>
          <tbody>
            {leaves.length === 0 ? (
              <tr>
                <td colSpan="6" style={styles.td}>No leave records found</td>
              </tr>
            ) : (
              leaves.map((leave) => (
                <tr key={leave._id}>
                  <td style={styles.td}>{leave.leaveType}</td>
                  <td style={styles.td}>{new Date(leave.fromDateTime).toLocaleString()}</td>
                  <td style={styles.td}>{new Date(leave.toDateTime).toLocaleString()}</td>
                  <td style={styles.td}>{leave.purpose}</td>
                  <td style={styles.td}>{leave.status || 'Pending'}</td>
                  <td style={styles.td}>
                   {leave.status !== 'Approved' ? (
                   <button
                     style={{ ...styles.button, backgroundColor: 'red' }}
                     onClick={() => handleDelete(leave._id)}
                     >
                    Delete
                    </button>
                       ) : (
                     <span style={{ color: 'gray' }}>—</span> // or leave empty
                        )}
                  </td>

                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const styles = {
  wrapper: {
    padding: '0 10px 30px 10px',
  },
  formContainer: {
    width: '100%',
    maxWidth: '700px',
    margin: '0 auto',
    backgroundColor: '#fff',
    padding: '30px',
    borderRadius: '10px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  },
  heading: {
    textAlign: 'center',
    marginBottom: '20px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    margin: '10px 0 5px',
    fontWeight: 'bold',
  },
  input: {
    padding: '10px',
    fontSize: '16px',
    borderRadius: '6px',
    border: '0.5px solid #ccc',
    boxShadow: 'inset 0 0 3px rgba(0,0,0,0.1)',
    outline: 'none',
  },
  button: {
    marginTop: '20px',
    padding: '12px',
    fontSize: '16px',
    backgroundColor: '#007BFF',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  th: {
    border: '1px solid #ddd',
    padding: '8px',
    backgroundColor: '#f2f2f2',
  },
  td: {
    border: '1px solid #ddd',
    padding: '8px',
    textAlign: 'center',
  },
};

export default Leave;
