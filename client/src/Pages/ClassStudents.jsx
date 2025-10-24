import React, { useState, useEffect } from "react";
import { classGet, get, getUser, post } from "../services/Endpoint";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import SecondNavUs from "../Components/SecondNavUs";

const styles = `
  /* Page Background */
  .page-container {
    background-color: #d3d8e0;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    position: relative;
  }

  /* Card Container for all content */
  .card-container {
    background-color: #fff;
    border-radius: 1rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 700px;
    padding: 0 2rem 2rem 2rem;
    margin-top: 1rem;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  /* Style for SecondNav to merge with the top of the card */
  .second-nav {
    background-color: #fff;
    border-top-left-radius: 1rem;
    border-top-right-radius: 1rem;
    padding: 0rem 0;
    margin: 0 -2rem;
  }

  /* Headings */
  .class-name {
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

  /* Register Number */
  .register-number {
    font-size: 1.25rem;
    font-weight: 500;
    color: #6b48ff;
    text-align: center;
  }

  .loading-text {
    font-size: 1.25rem;
    font-weight: 500;
    color: #6b48ff;
    display: flex;
    align-items: center;
  }

  .loading-dot {
    width: 1rem;
    height: 1rem;
    background-color: #6b48ff;
    border-radius: 50%;
    margin: 0 0.25rem;
    animation: bounce 0.6s infinite;
  }

  .loading-dot:nth-child(2) {
    animation-delay: 0.2s;
  }

  .loading-dot:nth-child(3) {
    animation-delay: 0.4s;
  }

  @keyframes bounce {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-0.5rem);
    }
  }

  /* Form Styles */
  .form-container {
    width: 100%;
    padding: 1.5rem;
    background-color: transparent;
    border: none;
    box-shadow: none;
  }

  .form-label {
    display: block;
    font-size: 1.1rem;
    font-weight: 600;
    color: #000;
    margin-bottom: 0.5rem;
  }

  .form-select,
  .form-input {
    width: 100%;
    padding: 0.75rem;
    background-color: #fff;
    border: 1px solid #d1d5db;
    border-radius: 0.5rem;
    font-size: 1rem;
    color: #333;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    transition: border-color 0.2s, box-shadow 0.2s;
  }

  .form-select:focus,
  .form-input:focus {
    outline: none;
    border-color: #6b48ff;
    box-shadow: 0 0 0 3px rgba(107, 72, 255, 0.2);
  }

  .form-input::placeholder {
    color: #999;
    font-style: italic;
  }

  .form-button {
    padding: 0.75rem 1.5rem;
    background-color: #6b48ff;
    color: #fff;
    border: none;
    border-radius: 0.5rem;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.2s, transform 0.2s;
  }

  .form-button:hover {
    background-color: #5a3de6;
    cursor: pointer;
    transform: scale(1.02);
  }

  .button-row {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 1.5rem;
  }

  /* Status Message */
  .status-message {
    margin-top: -1.7rem;
    font-size: 1.1rem;
    font-weight: 500;
    text-align: center;
  }

  .status-present {
    color: #28a745;
  }

  .status-error {
    color: #dc3545;
  }

  /* Table Styles */
  .attendance-table {
    width: 100%;
    border-collapse: collapse;
    background-color: #fff;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .attendance-table thead {
    background-color: #59499c;
    color: #fff;
  }

  .attendance-table th {
    padding: 16px 20px;
    text-align: left;
    font-weight: 600;
    font-size: 14px;
    text-transform: uppercase;
    line-height: 1.5;
  }

  .attendance-table tbody tr:nth-child(odd) {
    background-color: #f6f1ff;
  }

  .attendance-table tbody tr:nth-child(even) {
    background-color: #fff;
  }

  .attendance-table td {
    padding: 16px 20px;
    font-size: 14px;
    color: #333;
    line-height: 1.5;
  }

  /* Success Modal */
  .success-modal {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    color: #000;
    padding: 1.5rem;
    border-radius: 0.5rem;
    box-shadow: 0 0 15px 5px rgba(107, 72, 255, 0.3),
                0 0 15px 5px rgba(0, 122, 255, 0.3);
    text-align: center;
    z-index: 1000;
    animation: fadeIn 0.3s ease-in-out;
  }

  .success-checkmark {
    font-size: 3rem;
    color: #28a745;
    margin-bottom: 1rem;
    animation: scaleIn 0.5s ease-in-out;
  }

  .success-title {
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
  }

  .success-message {
    font-size: 1rem;
    font-weight: 400;
    color: #333;
  }

  /* Animations */
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translate(-50%, -60%);
    }
    to {
      opacity: 1;
      transform: translate(-50%, -50%);
    }
  }

  @keyframes scaleIn {
    from {
      transform: scale(0);
    }
    to {
      transform: scale(1);
    }
  }

  /* No Data Message */
  .no-data {
    text-align: center;
    color: #666;
    font-size: 1.1rem;
    margin-top: 2rem;
  }

  /* Responsive adjustments */
  @media (max-width: 768px) {
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

const ClassStudents = () => {
  const { id } = useParams();
  const [submittedOtp, setSubmittedOtp] = useState("");
  const [status, setStatus] = useState("absent");
  const [registerNumber, setRegisterNumber] = useState("");
  const [attendance, setAttendance] = useState([]);
  const [classData, setClassData] = useState(null);
  const [hour, setHour] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [userEmail, setUserEmail] = useState("");


  console.log("Class ID in ClassStudents:", id);
  const submitOTP = async () => {
    if (!submittedOtp) {
      toast.error("Please enter an OTP");
      return;
    }

    if (!classData) {
      setStatus("Class data not available");
      return;
    }
    const payload = {
      otp: submittedOtp,
      user: userEmail,
      classId: classData._id,
    };

    const alreadyMarked = attendance.some((record) => record.hour === hour);
    if (alreadyMarked) {
      toast.error(`Attendance for ${hour} is already marked.`);
      setHour("");
      setSubmittedOtp("");
      return;
    }

    try {
      const response = await post("/otp/submit", {
        otp: submittedOtp,
        user: userEmail,
        classId: classData._id,
      });
      if (response.data && response.data.status) {
        setStatus(response.data.status);
      } else {
        console.error("Unexpected response format:", response.data);
        toast.error("Invalid response from server");
      }
      setHour("");
      setSubmittedOtp("");
      if (response.data.status === "present") {
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 2000);
      }
      fetchAttendance(userEmail, classData._id);
    } catch (error) {
      if (error.response?.status === 400) {
        setSubmittedOtp("");
        toast.error(error.response.data.message);
      } else if (error.response?.status === 403) {
        setSubmittedOtp("");
        toast.error(error.response.data.message);
      } else if (error.response?.status === 402) {
        setSubmittedOtp("");
        toast.error(error.response.data.message);
      } else {
        toast.error("An unexpected error occurred");
      }
      setStatus("Invalid OTP");
    }
  };

  const fetchAttendance = async (email, classId) => {
    try {
      const response = await get(`/attendance/getattendance?classId=${classId}`);
      const today = new Date().toISOString().split("T")[0];
      const userAttendance = response.data.attendance.filter((record) => {
        const recordDate = new Date(record.createdAt).toISOString().split("T")[0];
        return (
          record.user === email &&
          record.classId === classId &&
          recordDate === today
        );
      });
      // Sort the attendance records by hour in ascending order
      userAttendance.sort((a, b) => a.hour.localeCompare(b.hour));
      setAttendance(userAttendance);
    } catch (error) {
      console.error("Failed to fetch attendance data:", error);
      toast.error("Failed to load attendance data.");
    }
  };

  const fetchClassData = async () => {
    try {
      const classresponse = await classGet(`/class/getclass/${id}`);
      setClassData(classresponse.data.classData);
    } catch (error) {
      console.error("Failed to fetch class data:", error);
      toast.error("Failed to load class data.");
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getUser();
        const userData = response.data.user;
        setUserEmail(userData.email);
      } catch (error) {
        console.error("Failed to fetch current user:", error);
        toast.error("Failed to load user data. Please log in again.");
      }
    };

    fetchClassData();
    fetchUser();
  }, []);

  useEffect(() => {
    if (userEmail && classData?._id) {
      fetchAttendance(userEmail, classData._id);
    }
  }, [userEmail, classData]);

  return (
    <div className="page-container">
      <style>{styles}</style>

      <div className="card-container">
        <div className="second-nav">
          <SecondNavUs classId={id} />
        </div>
        <h2 className="class-name">
          {classData ? classData.ClassName : "No class data available"}
        </h2>
        <form
          className="form-container"
          onSubmit={(e) => {
            e.preventDefault();
            submitOTP();
          }}
        >
          <div className="mb-6">
            <input
              type="text"
              className="form-input"
              value={submittedOtp}
              onChange={(e) => setSubmittedOtp(e.target.value)}
              placeholder="Enter OTP"
              required
            />
          </div>

          <div className="button-row">
            <button type="submit" className="form-button">
              Submit OTP
            </button>
          </div>
        </form>

        {status && (
          <div
            className={`status-message ${
              status === "present" ? "status-present" : "status-error"
            }`}
          >
            Status: {status}
          </div>
        )}

        {attendance.length > 0 ? (
          <div className="w-full">
            {/* <h3 className="section-title">Attendance Details</h3> */}
            <table className="attendance-table">
              <thead>
                <tr>
                  <th>Hour</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {attendance.map((record) => (
                  <tr key={record._id}>
                    <td>{record.hour}</td>
                    <td>{record.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="no-data">No attendance data found</div>
        )}
      </div>

      {showSuccess && (
        <div className="success-modal">
          <div className="success-checkmark">✔</div>
          <div className="success-title">Success!</div>
          <div className="success-message">Attendance marked successfully.</div>
        </div>
      )}
    </div>
  );
};

export default ClassStudents;