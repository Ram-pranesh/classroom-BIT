import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import SecondNav from '../Components/SecondNav';
import { classGet, classPost, downloadFile } from '../services/Endpoint';
import toast from 'react-hot-toast';
import { Trash2, Download, Folder, ChevronDown, ChevronUp } from 'lucide-react';

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

  /* Navigation Cards */
  .nav-cards-container {
    display: flex;
    justify-content: space-around;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .nav-card {
    background-color: #f9f9f9;
    border-radius: 0.5rem;
    padding: 1rem;
    text-align: center;
    cursor: pointer;
    flex: 1;
    min-width: 120px;
    transition: background-color 0.2s, transform 0.2s;
    border: 1px solid #e5e7eb;
  }

  .nav-card:hover {
    background-color: #e0e7ff;
    transform: scale(1.05);
  }

  .nav-card.active {
    background-color: #6b48ff;
    color: white;
    border-color: #6b48ff;
  }

  .nav-card-title {
    font-size: 1.1rem;
    font-weight: 600;
    margin: 0;
  }

  /* Content Container */
  .content-container {
    width: 100%;
    padding: 1.5rem;
    background-color: transparent;
    border: none;
    box-shadow: none;
    text-align: center;
  }

  /* No Classworks Message */
  .no-classworks {
    text-align: center;
    color: #6b7280;
    font-size: 1.25rem;
    margin: 1.5rem 0;
  }

  /* Loading Spinner */
  .spinner {
    width: 4rem;
    height: 4rem;
    border: 4px solid #6b48ff;
    border-top: 4px solid transparent;
    border-radius: 50%;
    animation: spin 1s linear infinite;
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

    .nav-card {
      min-width: 100px;
    }

    .no-classworks {
      font-size: 1rem;
    }
  }

  /* Styles for classwork management */
  .upload-form {
    margin-top: 1rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .file-input {
    padding: 0.5rem;
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem;
  }

  .upload-button {
    background-color: #6b48ff;
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    border: none;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .upload-button:hover {
    background-color: #5a3de6;
  }

  /* Folder-like structure for classworks */
  .classwork-group {
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem;
    margin: 0.5rem 0;
    background-color: #f9f9f9;
  }

  .classwork-group-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .classwork-group-header:hover {
    background-color: #e0e7ff;
  }

  .classwork-group-title {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 1.1rem;
    font-weight: 600;
    color: #333;
  }

  .classwork-group-actions {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .classwork-group-files {
    padding: 0.5rem 1rem;
    background-color: #fff;
    border-top: 1px solid #e5e7eb;
  }

  .classwork-file {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem 0;
  }

  .action-buttons {
    display: flex;
    gap: 2rem;
    position: relative;
  }

  .action-buttons button {
    border: none;
    cursor: pointer;
    transition: transform 0.2s, color 0.2s;
  }

  .delete-button {
    color: #f44336;
  }

  .delete-button:hover {
    color: #d32f2f;
    transform: scale(1.1);
  }

  .download-button {
    color: #4CAF50;
  }

  .download-button:hover {
    color: #388E3C;
    transform: scale(1.1);
  }

  /* Tooltip Styles for Icons */
  .action-buttons button::before,
  .classwork-group-actions button::before {
    content: attr(data-tooltip);
    position: absolute;
    bottom: 100%;
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
    transition: opacity 0.2s ease-in-out;
    z-index: 10;
    margin-bottom: 5px;
  }

  .action-buttons button::after,
  .classwork-group-actions button::after {
    content: '';
    position: absolute;
    bottom: 90%;
    left: 50%;
    transform: translateX(-50%);
    border-width: 5px;
    border-style: solid;
    border-color: #333 transparent transparent transparent;
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.2s ease-in-out;
  }

  .action-buttons button:hover::before,
  .action-buttons button:hover::after,
  .classwork-group-actions button:hover::before,
  .classwork-group-actions button:hover::after {
    opacity: 1;
    visibility: visible;
  }

  /* Drag and Drop Area */
  .drag-drop-area {
    border: 2px dashed #6b48ff;
    border-radius: 0.5rem;
    padding: 2rem;
    text-align: center;
    background-color: #f9f9f9;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .drag-drop-area.drag-over {
    background-color: #e0e7ff;
  }

  .drag-drop-text {
    color: #6b48ff;
    font-size: 1rem;
    font-weight: 500;
  }

  .file-list {
    margin-top: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .file-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem;
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem;
    background-color: #f9f9f9;
  }

  .file-item button {
    color: #f44336;
    border: none;
    background: none;
    cursor: pointer;
    transition: color 0.2s, transform 0.2s;
  }

  .file-item button:hover {
    color: #d32f2f;
    transform: scale(1.1);
  }

  /* Table Styles for Marks */
  .marks-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 1rem;
    background-color: #fff;
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem;
    overflow: hidden;
  }

  .marks-table th,
  .marks-table td {
    padding: 0.75rem;
    text-align: center;
    border-bottom: 1px solid #e5e7eb;
  }

  .marks-table th {
    background-color: #6b48ff;
    color: white;
    font-weight: 600;
    font-size: 1rem;
  }

  .marks-table td {
    color: #333;
    font-size: 0.95rem;
  }

  .marks-table tr:nth-child(even) {
    background-color: #f9f9f9;
  }

  .marks-table tr:hover {
    background-color: #e0e7ff;
  }

  /* Editable Input for Marks */
  .marks-input {
    width: 60px;
    padding: 0.5rem;
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem;
    font-size: 0.95rem;
    text-align: center;
  }

  .marks-input:focus {
    outline: none;
    border-color: #6b48ff;
    box-shadow: 0 0 0 2px rgba(107, 72, 255, 0.2);
  }

  /* Submit Button for Marks */
  .submit-marks-button {
    background-color: #6b48ff;
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    border: none;
    cursor: pointer;
    font-size: 1rem;
    font-weight: 500;
    margin-top: 1rem;
    transition: background-color 0.2s;
  }

  .submit-marks-button:hover {
    background-color: #5a3de6;
  }

  /* Responsive adjustments for table and inputs */
  @media (max-width: 768px) {
    .marks-table th,
    .marks-table td {
      padding: 0.5rem;
      font-size: 0.85rem;
    }

    .marks-input {
      width: 50px;
      padding: 0.4rem;
      font-size: 0.85rem;
    }

    .submit-marks-button {
      padding: 0.4rem 0.8rem;
      font-size: 0.9rem;
    }
  }
`;

const Classwork = () => {
  const { id } = useParams();
  const [classData, setClassData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [classworks, setClassworks] = useState([]);
  const [files, setFiles] = useState([]);
  const [title, setTitle] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState({});
  const [activeTab, setActiveTab] = useState('Course Material');
  const [marksData, setMarksData] = useState([
    { name: 'Renesh', pt1: 49, pt2: 50, pt3: 35 },
    { name: 'Jinesh', pt1: 39, pt2: 62, pt3: 51 },
    { name: 'Surya', pt1: 45, pt2: 85, pt3: 29 },
  ]);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const classResponse = await classGet(`/class/getclass/${id}`);
        setClassData(classResponse.data.classData);
        
        const classworkResponse = await classGet(`/class/classwork/${id}`);
        console.log('Classwork Response:', classworkResponse.data);
        setClassworks(classworkResponse.data.classworks || []);
      } catch (error) {
        console.error('Failed to fetch data:', error);
        if (error.response?.status === 404) {
          setError('No classwork found for this class. Please upload classwork to get started.');
          console.log("Setting error for 404:", 'No classwork found for this class. Please upload classwork to get started.');
        } else {
          setError('Failed to load data. Please try again later.');
          toast.error('Failed to load data.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    setFiles((prevFiles) => [...prevFiles, ...droppedFiles]);
  };

  const handleRemoveFile = (index) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (files.length === 0 || !title) {
      toast.error('Please provide a title and at least one file');
      return;
    }

    const formData = new FormData();
    files.forEach((file) => formData.append('files', file));
    formData.append('title', title);
    formData.append('classId', id);

    try {
      console.log('Uploading files with data:', { title, classId: id, files: files.map(f => f.name) });
      const response = await classPost('/class/classwork/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Upload response:', response.data);
      setClassworks((prev) => [...prev, ...response.data.classworks]);
      setFiles([]);
      setTitle('');
      setError(null);
      toast.success('Classwork uploaded successfully');
    } catch (error) {
      console.error('Upload error:', error.response?.data || error.message);
      toast.error(`Failed to upload classwork: ${error.response?.data?.message || 'Unknown error'}`);
    }
  };

  const handleDelete = async (classworkId) => {
    try {
      await classPost(`/class/classwork/delete/${classworkId}`);
      setClassworks(classworks.filter(cw => cw._id !== classworkId));
      toast.success('Classwork deleted successfully');
    } catch (error) {
      console.error('Delete error:', error.response?.data || error.message);
      toast.error('Failed to delete classwork');
    }
  };

  const handleDeleteGroup = async (group) => {
    try {
      await Promise.all(
        group.map(async (classwork) => {
          await classPost(`/class/classwork/delete/${classwork._id}`);
        })
      );
      setClassworks(classworks.filter(cw => !group.some(item => item._id === cw._id)));
      toast.success('Folder deleted successfully');
    } catch (error) {
      console.error('Delete group error:', error.response?.data || error.message);
      toast.error('Failed to delete folder');
    }
  };

  const handleDownload = async (classworkId, filename) => {
    try {
      const response = await downloadFile(`/class/classwork/download/${classworkId}`);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('Download started');
    } catch (error) {
      console.error('Download error:', error.response?.data || error.message);
      toast.error('Failed to download file');
    }
  };

  const handleMarkChange = (index, field, value) => {
    const updatedMarks = [...marksData];
    updatedMarks[index][field] = parseInt(value) || 0; // Convert to number, default to 0 if invalid
    setMarksData(updatedMarks);
  };

  const handleSubmitMarks = () => {
    console.log('Updated Marks:', marksData);
    toast.success('Marks saved successfully');
    // Replace with actual API call if needed, e.g.:
    // await classPost('/class/marks/update', { classId: id, marks: marksData });
  };

  // Group classworks by title
  const groupedClassworks = classworks.reduce((acc, classwork) => {
    const key = classwork.title;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(classwork);
    return acc;
  }, {});

  const toggleGroup = (title) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <style>{styles}</style>
      <div className="card-container">
        <div className="second-nav">
          <SecondNav classId={id} />
        </div>
        <h2 className="class-name">{classData ? classData.ClassName : 'No class data available'}</h2>
        <div className="nav-cards-container">
          {['Course Material', 'Assignment', 'Marks'].map((tab) => (
            <div
              key={tab}
              className={`nav-card ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              <h3 className="nav-card-title">{tab}</h3>
            </div>
          ))}
        </div>
        <div className="content-container">
          {['Course Material', 'Assignment'].includes(activeTab) ? (
            <>
              <h3 className="section-title">{activeTab}</h3>
              {/* Display error message if it exists, but continue rendering the form */}
              {/* {error && (
                <div className="text-red-500 text-center mt-10 mb-4">{error}</div>
              )} */}
              {/* Upload Form */}
              <form className="upload-form" onSubmit={handleFileUpload}>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Classwork title"
                  className="file-input"
                />
                <div
                  className={`drag-drop-area ${dragOver ? 'drag-over' : ''}`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current.click()}
                >
                  <p className="drag-drop-text">
                    Drag and drop files here or click to select files
                  </p>
                  <input
                    type="file"
                    name="files"
                    multiple
                    onChange={handleFileChange}
                    className="file-input"
                    accept=".pdf,.jpg,.jpeg,.png"
                    style={{ display: 'none' }}
                    ref={fileInputRef}
                  />
                </div>
                {files.length > 0 && (
                  <div className="file-list">
                    {files.map((file, index) => (
                      <div key={index} className="file-item">
                        <span>{file.name}</span>
                        <button onClick={() => handleRemoveFile(index)}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <button type="submit" className="upload-button">Upload Classwork</button>
              </form>
              {/* Classwork List (Grouped by Title) */}
              {Object.keys(groupedClassworks).length > 0 ? (
                Object.entries(groupedClassworks).map(([title, group]) => (
                  <div key={title} className="classwork-group">
                    <div className="classwork-group-header">
                      <div className="classwork-group-title" onClick={() => toggleGroup(title)}>
                        <Folder size={20} color="#6b48ff" />
                        <span>{title}</span>
                      </div>
                      <div className="classwork-group-actions">
                        <button
                          className="delete-button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteGroup(group);
                          }}
                          data-tooltip="Delete Folder"
                        >
                          <Trash2 size={20} />
                        </button>
                        {expandedGroups[title] ? <ChevronUp size={20} onClick={() => toggleGroup(title)} /> : <ChevronDown size={20} onClick={() => toggleGroup(title)} />}
                      </div>
                    </div>
                    {expandedGroups[title] && (
                      <div className="classwork-group-files">
                        {group.map((classwork) => (
                          <div key={classwork._id} className="classwork-file">
                            <span>{classwork.originalFilename || classwork.filename}</span>
                            <div className="action-buttons">
                              <button
                                className="delete-button"
                                onClick={() => handleDelete(classwork._id)}
                                data-tooltip="Delete Classwork"
                              >
                                <Trash2 size={20} />
                              </button>
                              <button
                                className="download-button"
                                onClick={() => handleDownload(classwork._id, classwork.originalFilename || classwork.filename)}
                                data-tooltip="Download Classwork"
                              >
                                <Download size={20} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p className="no-classworks">No classworks available.</p>
              )}
            </>
          ) : (
            <>
              <h3 className="section-title">{activeTab}</h3>
              {/* The Table diplays the marks of the all students for an admin , and for user or students only their respective marks will be displayed  */}
              <table className="marks-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>PT1</th>
                    <th>PT2</th>
                    <th>Optional</th>
                  </tr>
                </thead>
                <tbody>
                  {marksData.map((student, index) => (
                    <tr key={index}>
                      <td>{student.name}</td>
                      <td>
                        <input
                          type="number"
                          className="marks-input"
                          value={student.pt1}
                          onChange={(e) => handleMarkChange(index, 'pt1', e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          className="marks-input"
                          value={student.pt2}
                          onChange={(e) => handleMarkChange(index, 'pt2', e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          className="marks-input"
                          value={student.pt3}
                          onChange={(e) => handleMarkChange(index, 'pt3', e.target.value)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button className="submit-marks-button" onClick={handleSubmitMarks}>
                Submit
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Classwork;