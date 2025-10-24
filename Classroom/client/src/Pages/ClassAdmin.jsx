import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { classGet, downloadFile, get, post } from '../services/Endpoint';
import { UserPlus } from 'lucide-react';
import toast from 'react-hot-toast';
import SecondNav from '../Components/SecondNav';

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

  .form-select {
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

  .form-select:focus {
    outline: none;
    border-color: #6b48ff;
    box-shadow: 0 0 0 3px rgba(107, 72, 255, 0.2);
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

  .add-students-button {
    color: #6b48ff;
    transition: transform 0.2s;
  }

  .add-students-button:hover {
    transform: scale(1.15);
    cursor: pointer;
  }

  .button-row {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 1.5rem;
    gap: 1rem;
  }

  .table-controls {
    width: 100%;
    margin-bottom: 1rem;
    display: flex;
    justify-content: center;
    gap: 1rem;
    flex-wrap: wrap;
    align-items: center;
  }

  .search-input {
    width: 450px;
    padding: 0.5rem 0.75rem;
    background-color: #fff;
    border: 1px solid #d1d5db;
    border-radius: 0.5rem;
    font-size: 0.9rem;
    color: #333;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    transition: border-color 0.2s, box-shadow 0.2s;
  }

  .search-input:focus {
    outline: none;
    border-color: #6b48ff;
    box-shadow: 0 0 0 3px rgba(107, 72, 255, 0.2);
  }

  .search-input::placeholder {
    color: #999;
    font-style: italic;
  }

  .filter-select {
    width: 120px;
    padding: 0.5rem 0.75rem;
    background-color: #fff;
    border: 1px solid #d1d5db;
    border-radius: 0.5rem;
    font-size: 0.9rem;
    color: #333;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    transition: border-color 0.2s, box-shadow 0.2s;
  }

  .filter-select:focus {
    outline: none;
    border-color: #6b48ff;
    box-shadow: 0 0 0 3px rgba(107, 72, 255, 0.2);
  }

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

  .attendance-table th.sortable {
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .attendance-table th.sortable:hover {
    background-color:#8877d1;
  }

  .attendance-table th.sortable::after {
    content: '↕';
    margin-left: 0.5rem;
    font-size: 12px;
  }

  .attendance-table tbody tr:nth-child(odd) {
    background-color:#f6f1ff;
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

  .success-card {
    position: relative;
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

  .success-card.boom {
    animation: boom 0.5s ease-in-out forwards;
  }

  .otp-value {
    font-size: 2.5rem;
    font-weight: 800;
    color: #6b48ff;
    margin-bottom: 0.5rem;
  }

  .timer-text {
    font-size: 1rem;
    font-weight: 400;
    color: #333;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes boom {
    0% {
      transform: scale(1);
      opacity: 1;
    }
    50% {
      transform: scale(1.2);
      opacity: 0.8;
    }
    100% {
      transform: scale(0);
      opacity: 0;
    }
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

  .modal-content input[type="date"] {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #d1d5db;
    border-radius: 0.5rem;
    font-size: 1rem;
    color: #333;
    box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  .modal-content input[type="date"]:focus {
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

    .search-input {
      width: 100%;
      max-width: 300px;
    }

    .filter-select {
      width: 100px;
    }
  }
`;

const ClassAdmin = () => {
  const { id } = useParams();
  const [classData, setClassData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [otp, setOtp] = useState("");
  const [timeLeft, setTimeLeft] = useState(15);
  const [attendance, setAttendance] = useState([]);
  const [hour, setHour] = useState("");
  const [showOtpModal, setShowOtpModal] = useState(false); // State for OTP modal
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [hourFilter, setHourFilter] = useState("");
  const [totalUsers, setTotalUsers] = useState(0);
  const [presentCount, setPresentCount] = useState(0);
  const [absentCount, setAbsentCount] = useState(0);
  const [showDateModal, setShowDateModal] = useState(false);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [displayFromDate, setDisplayFromDate] = useState("");
  const [displayToDate, setDisplayToDate] = useState("");
  const navigate = useNavigate();

  const addStudentsRedirect = () => {
    navigate(`/admin/classadmin/${id}/addStudents`);
  };

  const fetchAttendanceData = async (from = null, to = null) => {
    try {
      let query = `/attendance/getattendance?classId=${id}`;
      if (from && to) {
        query += `&fromDate=${from}&toDate=${to}`;
      }
      console.log("Fetching attendance with query:", query);
      const response = await get(query);
      console.log("Attendance response:", response.data);
      const { attendance, totalUsers, presentCount, absentCount } = response.data;
      setAttendance(attendance || []);
      setTotalUsers(totalUsers || 0);
      setPresentCount(presentCount || 0);
      setAbsentCount(absentCount || 0);
      setDisplayFromDate(from || new Date().toISOString().split("T")[0]);
      setDisplayToDate(to || new Date().toISOString().split("T")[0]);
    } catch (error) {
      console.error("Failed to fetch attendance data:", error);
      toast.error("Failed to fetch attendance data. Please try again.");
      setAttendance([]);
      setTotalUsers(0);
      setPresentCount(0);
      setAbsentCount(0);
    }
  };

  const generateOTP = async () => {
    if (!hour || hour === "-- Select Hour --") {
      toast.error("Please select an hour before generating OTP.");
      return;
    }
    const newOtp = Math.floor(10000 + Math.random() * 900000).toString();
    setOtp(newOtp);
    setTimeLeft(15);
    setShowOtpModal(true); // Show the OTP modal
    try {
      await post("/otp/generate", { otp: newOtp, classId: id, hour });
      toast.success("OTP generated successfully!");
      setHour("");
    } catch (error) {
      console.error("Failed to generate OTP:", error);
      toast.error("Failed to generate OTP. Please try again.");
      setShowOtpModal(false);
    }
  };

  const closeOtpModal = () => {
    setShowOtpModal(false);
    setOtp("");
    setTimeLeft(0);
    fetchAttendanceData(displayFromDate, displayToDate);
  };

  const openDateModal = () => {
    setShowDateModal(true);
    const today = new Date().toISOString().split("T")[0];
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
    setFromDate(sevenDaysAgo);
    setToDate(today);
  };

  const closeDateModal = () => {
    setShowDateModal(false);
    setFromDate("");
    setToDate("");
  };

  const handleDownloadReport = async () => {
    if (!fromDate || !toDate) {
      toast.error("Please select both From and To dates.");
      return;
    }

    if (new Date(fromDate) > new Date(toDate)) {
      toast.error("From Date cannot be later than To Date.");
      return;
    }

    try {
      const response = await downloadFile(`/attendance/downloadreport?classId=${id}&fromDate=${fromDate}&toDate=${toDate}`);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Attendance_Report_${fromDate}_to_${toDate}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('Attendance report downloaded successfully');
      closeDateModal();
    } catch (error) {
      if (error.response && error.response.status === 404) {
        toast.error(error.response.data.message || "No attendance data found for the selected date range.");
      } else {
        console.error('Download error:', error.response?.data || error.message);
        toast.error('Failed to download attendance report. Please try again.');
      }
    }
  };

  const handleViewReport = async () => {
    if (!fromDate || !toDate) {
      toast.error("Please select both From and To dates.");
      return;
    }

    if (new Date(fromDate) > new Date(toDate)) {
      toast.error("From Date cannot be later than To Date.");
      return;
    }

    setSearchTerm("");
    setHourFilter("");
    await fetchAttendanceData(fromDate, toDate);
    closeDateModal();
    toast.success(`Showing attendance data from ${fromDate} to ${toDate}`);
  };

  useEffect(() => {
    const fetchClassData = async () => {
      try {
        const response = await classGet(`/class/getclass/${id}`);
        setClassData(response.data.classData);
      } catch (error) {
        console.error("Failed to fetch class data:", error);
        setError("Failed to load class data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchClassData();
    fetchAttendanceData();
  }, [id]);

  useEffect(() => {
    if (timeLeft > 0 && otp) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      closeOtpModal();
    }
  }, [timeLeft, otp]);

  // Group attendance by date and user to calculate percentages
  const groupedAttendance = {};
  attendance.forEach((record) => {
    const recordDate = new Date(record.createdAt).toISOString().split("T")[0];
    if (!groupedAttendance[recordDate]) {
      groupedAttendance[recordDate] = {};
    }
    if (!groupedAttendance[recordDate][record.user]) {
      groupedAttendance[recordDate][record.user] = [];
    }
    groupedAttendance[recordDate][record.user].push(record);
  });

  // Sort dates in descending order
  const sortedDates = Object.keys(groupedAttendance).sort((a, b) => new Date(b) - new Date(a));

  // Flatten the grouped data for rendering while applying filters
  const filteredAndSortedAttendance = [];
  sortedDates.forEach((date) => {
    Object.keys(groupedAttendance[date]).forEach((user) => {
      const userRecords = groupedAttendance[date][user]
        .filter((record) => {
          const matchesSearch = record.user.toLowerCase().includes(searchTerm.toLowerCase());
          const matchesHour = hourFilter ? record.hour === hourFilter : true;
          return matchesSearch && matchesHour;
        })
        .sort((a, b) => {
          if (sortOrder === "asc") {
            return a.hour.localeCompare(b.hour);
          } else {
            return b.hour.localeCompare(a.hour);
          }
        });

      if (userRecords.length > 0) {
        const hoursPresent = userRecords.filter(record => record.status === "present").length;
        const totalHours = 7; // Assuming 7 hours per day
        const percentage = ((hoursPresent / totalHours) * 100).toFixed(2);
        userRecords.forEach((record, index) => {
          filteredAndSortedAttendance.push({
            ...record,
            date,
            percentage,
            isFirstRecord: index === 0,
            rowSpan: userRecords.length,
          });
        });
      }
    });
  });

  console.log("Filtered and sorted attendance:", filteredAndSortedAttendance);

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
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
    <div className="page-container">
      <style>{styles}</style>
      <div className="card-container">
        <div className="second-nav">
          <SecondNav classId={id} />
        </div>
        <h2 className="class-name">{classData ? classData.ClassName : "No class data available"}</h2>

        <form className="form-container">
          <div className="mb-6">
            <label className="form-label">Select Time:</label>
            <select
              className="form-select"
              value={hour}
              onChange={(e) => setHour(e.target.value)}
              
            >
              <option value="">-- Select Hour --</option>
              <option value="I Hour">I Hour</option>
              <option value="II Hour">II Hour</option>
              <option value="III Hour">III Hour</option>
              <option value="IV Hour">IV Hour</option>
              <option value="V Hour">V Hour</option>
              <option value="VI Hour">VI Hour</option>
              <option value="VII Hour">VII Hour</option>
            </select>
          </div>

          <div className="button-row">
            <button type="button" className="form-button" onClick={generateOTP}>
              Generate OTP
            </button>
            <button type="button" className="form-button" onClick={openDateModal}>
              Report
            </button>
          </div>
        </form>

        {showOtpModal && otp && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h3>Generated OTP</h3>
              <div className={`success-card ${timeLeft === 0 ? "boom" : ""}`}>
                <div className="otp-value">{otp}</div>
                <div className="timer-text">Expires in {timeLeft}s</div>
              </div>
              {/* <div className="modal-buttons">
                <button className="modal-button cancel" onClick={closeOtpModal}>
                  Close
                </button>
              </div> */}
            </div>
          </div>
        )}

        {showDateModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h3>Select Date Range</h3>
              <label>From Date:</label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                max={toDate || new Date().toISOString().split("T")[0]}
              />
              <label>To Date:</label>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                min={fromDate}
                max={new Date().toISOString().split("T")[0]}
              />
              <div className="modal-buttons">
                <button className="modal-button confirm" onClick={handleViewReport}>
                  View
                </button>
                <button className="modal-button confirm" onClick={handleDownloadReport}>
                  Download
                </button>
                <button className="modal-button cancel" onClick={closeDateModal}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {attendance.length > 0 ? (
          <div className="w-full">
            {/* <h3 className="section-title">Attendance Details</h3> */}
            <div className="flex justify-center items-center mb-4 gap-4">
              <span className="text-lg font-semibold">Total Students: {totalUsers}</span>
              <span className="text-lg font-semibold text-green-600">Present: {presentCount}</span>
              <span className="text-lg font-semibold text-red-600">Absent: {absentCount}</span>
            </div>
            <div className="table-controls">
              <input
                type="text"
                className="search-input"
                placeholder="Search by Name or Email"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <select
                className="filter-select"
                value={hourFilter}
                onChange={(e) => setHourFilter(e.target.value)}
              >
                <option value="">All Hours</option>
                <option value="I Hour">I Hour</option>
                <option value="II Hour">II Hour</option>
                <option value="III Hour">III Hour</option>
                <option value="IV Hour">IV Hour</option>
                <option value="V Hour">V Hour</option>
                <option value="VI Hour">VI Hour</option>
                <option value="VII Hour">VII Hour</option>
              </select>
            </div>

            <table className="attendance-table">
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Status</th>
                  <th className="sortable" onClick={toggleSortOrder}>
                    Hour {sortOrder === "asc" ? "↑" : "↓"}
                  </th>
                  {/* <th>Date</th>
                  <th>Percentage</th> */}
                </tr>
              </thead>
              <tbody>
                {filteredAndSortedAttendance.map((record, index) => (
                  <tr key={record._id}>
                    <td>{record.user}</td>
                    <td>{record.status}</td>
                    <td>{record.hour || "N/A"}</td>
                    {/* <td>{record.date}</td>
                    {record.isFirstRecord && (
                      <td rowSpan={record.rowSpan}>{record.percentage}%</td>
                    )} */}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="no-data">No attendance data found</div>
        )}
      </div>
    </div>
  );
};

export default ClassAdmin;