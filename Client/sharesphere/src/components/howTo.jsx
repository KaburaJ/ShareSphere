import React, { useState } from 'react';
import './styles/howto.css';

const HowToGuide = ({ onClose }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const handleNextPage = () => {
    if (currentPage < 3) {
      setCurrentPage(currentPage + 1);
    } else {
      onClose();
    }
  };

  return (
    <div className="how-to-guide">
      <div className="guide-content">
        {currentPage === 1 && (
          <>
            <h2>Welcome to ShareSphere</h2>
            <p>Step 1: This is the first step of the guide.</p>
          </>
        )}

        {currentPage === 2 && (
          <>
            <h2>Getting Started</h2>
            <p>Step 2: This is the second step of the guide.</p>
          </>
        )}

        {currentPage === 3 && (
          <>
            <h2>Final Step</h2>
            <p>Step 3: This is the final step of the guide.</p>
          </>
        )}
      </div>
      <div className="guide-navigation">
        <button onClick={handleNextPage}>
          {currentPage < 3 ? 'Next' : 'Finish'}
        </button>
      </div>
    </div>
  );
};

export default HowToGuide;
