import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { classGet, downloadFile } from '../services/Endpoint';
import toast from 'react-hot-toast';
import SecondNavUs from '../Components/SecondNavUs';
import { Download, Eye, Folder, ChevronDown, ChevronUp } from 'lucide-react';

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

  /* Error Message */
  .error-message {
    text-align: center;
    color: #f44336;
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

    .no-classworks {
      font-size: 1rem;
    }

    .error-message {
      font-size: 1rem;
    }
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

  .view-button {
    color: #2196F3;
  }

  .view-button:hover {
    color: #1976D2;
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
  .action-buttons button::before {
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

  .action-buttons button::after {
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
  .action-buttons button:hover::after {
    opacity: 1;
    visibility: visible;
  }
`;

const ClassworkUs = () => {
  const { id } = useParams();
  const [classData, setClassData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [classworks, setClassworks] = useState([]);
  const [expandedGroups, setExpandedGroups] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const classResponse = await classGet(`/class/getclass/${id}`);
        setClassData(classResponse.data.classData);
        
        const classworkResponse = await classGet(`/class/classwork/${id}`);
        setClassworks(classworkResponse.data.classworks || []);
      } catch (error) {
        console.error('Failed to fetch data:', error);
        if (error.response?.status === 404) {
          setError('No classwork Data found');
          toast.error('No classwork Data found');
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

  const handleDownload = async (classworkId, filename) => {
    try {
      const response = await downloadFile(`/class/classwork/download/${classworkId}`, {
        responseType: 'blob',
      });

      if (response.data.type === "application/json") {
        const errorText = await response.data.text();
        console.error("Server Error:", errorText);
        toast.error(`Download failed: ${errorText}`);
        return;
      }
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

  const handleView = (classworkId, filename) => {
    try {
      const fileUrl = `${import.meta.env.VITE_SERVER_APP_URL}/images/${filename}`;
      window.open(fileUrl, '_blank');
      toast.success('Opening file in new tab');
    } catch (error) {
      console.error('View error:', error);
      toast.error('Failed to view file');
    }
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
          <SecondNavUs classId={id} />
        </div>
        <h2 className="class-name">{classData ? classData.ClassName : 'No class data available'}</h2>
        <div className="content-container">
          <h3 className="section-title">Classwork</h3>
          
          {/* Display error message if it exists, but continue rendering the rest of the page */}
          {error && (
            <div className="error-message">{error}</div>
          )}

          {/* Classwork List (Grouped by Title) */}
          {Object.keys(groupedClassworks).length > 0 ? (
            Object.entries(groupedClassworks).map(([title, group]) => (
              <div key={title} className="classwork-group">
                <div className="classwork-group-header" onClick={() => toggleGroup(title)}>
                  <div className="classwork-group-title">
                    <Folder size={20} color="#6b48ff" />
                    <span>{title}</span>
                  </div>
                  {expandedGroups[title] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
                {expandedGroups[title] && (
                  <div className="classwork-group-files">
                    {group.map((classwork) => (
                      <div key={classwork._id} className="classwork-file">
                        <span>{classwork.originalFilename || classwork.filename}</span>
                        <div className="action-buttons">
                          <button
                            className="view-button"
                            onClick={() => handleView(classwork._id, classwork.filename)}
                            data-tooltip="View Classwork"
                          >
                            <Eye size={20} />
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
            !error && <p className="no-classworks">No classwork available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClassworkUs;