import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import MentorNav from '../Components/MentorNav';
const BaseUrl = import.meta.env.VITE_SERVER_APP_URL;

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
    margin-top: 4.5rem;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  /* Style for MentorNav to merge with the top of the card */
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

  /* Dropdown Styles */
  .dropdown-container {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-bottom: 2rem;
  }

  .dropdown-select {
    width: 100%;
    padding: 0.75rem;
    font-size: 1rem;
    border: 2px solid #6b48ff;
    border-radius: 0.5rem;
    background-color: white;
    cursor: pointer;
    max-height: 200px;
    overflow-y: auto;
  }

  .dropdown-select:focus {
    outline: none;
    border-color: #5a3de6;
  }

  .download-button {
    background-color: #28a745;
    color: white;
    padding: 0.75rem 2rem;
    border: none;
    border-radius: 0.5rem;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.2s;
    width: 100%;
  }

  .download-button:hover {
    background-color: #218838;
  }

  .download-button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }

  .info-message {
    text-align: center;
    color: #666;
    font-size: 0.95rem;
    padding: 1rem;
    background-color: #f0f0f0;
    border-radius: 0.5rem;
    margin-top: 1rem;
  }

  .success-message {
    text-align: center;
    color: #28a745;
    font-size: 1rem;
    padding: 1rem;
    background-color: #d4edda;
    border-radius: 0.5rem;
    margin-top: 1rem;
    border: 1px solid #28a745;
  }

  .error-message {
    text-align: center;
    color: #dc3545;
    font-size: 1rem;
    padding: 1rem;
    background-color: #f8d7da;
    border-radius: 0.5rem;
    margin-top: 1rem;
    border: 1px solid #dc3545;
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

const Report = () => {
  const { classId } = useParams();
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const categories = [
    'Paper Presentations',
    'Publications',
    'Patents',
    'Entrepreneurship',
    'Placement',
    'Project Details',
    'Competitions',
    'Internship',
    'Online Course',
    'Product Development'
  ];

  const categoryFieldMap = {
    'Paper Presentations': 'paperPresentations',
    'Publications': 'publications',
    'Patents': 'patents',
    'Entrepreneurship': 'entrepreneurship',
    'Placement': 'placement',
    'Project Details': 'projectDetails',
    'Competitions': 'competitions',
    'Internship': 'internship',
    'Online Course': 'onlineCourse',
    'Product Development': 'productDevelopment'
  };

  const formatDateForExcel = (value, key) => {
    const isDateField = key.toLowerCase().includes('date') || 
                       key.toLowerCase().includes('year') ||
                       key.toLowerCase().includes('passing');
    
    if (isDateField && value) {
      try {
        const date = new Date(value);
        if (!isNaN(date.getTime())) {
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const day = String(date.getDate()).padStart(2, '0');
          return `${year}-${month}-${day}`;
        }
      } catch (e) {
        return value;
      }
    }
    return value;
  };

  const handleDownload = async () => {
    if (!selectedCategory) {
      setMessage({ type: 'error', text: 'Please select a category first' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // Get mentee emails from localStorage
      const students = JSON.parse(localStorage.getItem('students')) || [];
      const menteeEmails = students.map(student => student.email);

      if (menteeEmails.length === 0) {
        setMessage({ type: 'error', text: 'No students found. Please add students first.' });
        setLoading(false);
        return;
      }

      // Fetch achievements for the selected category
      const response = await fetch(`${BaseUrl}/api/achievements/filter`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          emails: menteeEmails,
          category: selectedCategory
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        setMessage({ type: 'error', text: data.message || 'Error fetching data' });
        setLoading(false);
        return;
      }

      const results = data.results || [];

      if (results.length === 0) {
        setMessage({ type: 'error', text: `No ${selectedCategory} data found for your mentees.` });
        setLoading(false);
        return;
      }

      // Generate CSV for all students
      const categoryKey = categoryFieldMap[selectedCategory];
      let csvContent = '';
      
      // Add Student Name as the first column
      const allKeys = new Set(['Student Name']);
      
      // Collect all unique field keys from all students
      results.forEach(result => {
        const achievements = result.achievements[categoryKey] || [];
        achievements.forEach(achievement => {
          Object.keys(achievement).forEach(key => {
            if (key !== '_id') allKeys.add(key);
          });
        });
      });

      const headers = Array.from(allKeys);
      csvContent = headers.join(',') + '\n';

      // Add data rows for each student
      results.forEach(result => {
        const studentName = result.studentName;
        const achievements = result.achievements[categoryKey] || [];
        
        achievements.forEach(achievement => {
          const row = headers.map(header => {
            if (header === 'Student Name') {
              return `"${studentName}"`;
            }
            
            let value = achievement[header] || '';
            const formattedValue = formatDateForExcel(value, header);
            let stringValue = String(formattedValue);
            
            stringValue = stringValue.replace(/\n/g, ' ').replace(/\r/g, ' ');
            
            const needsQuotes = stringValue.includes(',') || 
                               stringValue.includes('"') || 
                               stringValue.includes('\n') ||
                               stringValue.startsWith('=') ||
                               stringValue.startsWith('+') ||
                               stringValue.startsWith('-') ||
                               stringValue.startsWith('@');
            
            if (needsQuotes) {
              stringValue = `"${stringValue.replace(/"/g, '""')}"`;
            }
            
            return stringValue;
          });
          csvContent += row.join(',') + '\n';
        });
      });

      // Add BOM for UTF-8
      const BOM = '\uFEFF';
      csvContent = BOM + csvContent;

      // Create and trigger download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      const fileName = `${selectedCategory.replace(/\s+/g, '_')}_Report_${new Date().toISOString().split('T')[0]}.csv`;
      
      link.setAttribute('href', url);
      link.setAttribute('download', fileName);
      link.style.visibility = 'hidden';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setTimeout(() => URL.revokeObjectURL(url), 100);

      setMessage({ 
        type: 'success', 
        text: `Successfully downloaded ${results.length} student(s) data for ${selectedCategory}!` 
      });

    } catch (error) {
      console.error('Error downloading report:', error);
      setMessage({ type: 'error', text: 'Failed to download report. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="page-container">
        <div className="card-container">
          <div className="second-nav">
            <MentorNav classId={classId} />
          </div>
          <h1 className="class-name">Report</h1>

          <div className="dropdown-container">
            <select
              className="dropdown-select"
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setMessage({ type: '', text: '' });
              }}
            >
              <option value="">Select a category</option>
              {categories.map((category, idx) => (
                <option key={idx} value={category}>
                  {category}
                </option>
              ))}
            </select>

            <button 
              className="download-button" 
              onClick={handleDownload}
              disabled={loading || !selectedCategory}
            >
              {loading ? 'Generating Report...' : 'Download Report'}
            </button>
          </div>

          {!selectedCategory && !message.text && (
            <div className="info-message">
              Select a category and click "Download Report" to get a consolidated CSV file of all your mentees' achievements in that category.
            </div>
          )}

          {message.text && (
            <div className={message.type === 'success' ? 'success-message' : 'error-message'}>
              {message.text}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Report;
