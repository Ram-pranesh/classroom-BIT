import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import SecondNav from '../Components/SecondNav';
import { classGet } from '../services/Endpoint';
import toast from 'react-hot-toast';

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
  }
`;

const StreamAdmin = () => {
  const { id } = useParams();
  const [classData, setClassData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const classResponse = await classGet(`/class/getclass/${id}`);
        setClassData(classResponse.data.classData);
      } catch (error) {
        console.error('Failed to fetch data:', error);
        setError('Failed to load data. Please try again later.');
        toast.error('Failed to load data.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

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
        <h2 className="class-name">{classData ? classData.ClassName : 'No class data available'}</h2>
        <p style={{textAlign:'center'}}>No data Available </p>
      </div>
    </div>
  );
};

export default StreamAdmin;