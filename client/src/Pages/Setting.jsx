import React from 'react'
const styles=`

.page-container {
    min-height: 100vh;
    background-color: #f5f5f5;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  /* Text Styling */
  .page-title {
    font-size: 1.5rem;
    font-weight: 600;
    color: #333;
    text-align: center;
  }

`;

const Setting = () => {
    return (
        <>
        <style>{styles}</style>
        <div className="page-container">
          <h1 className="page-title">Hello from Setting page</h1>
        </div>
        </>   
      )
}

export default Setting
