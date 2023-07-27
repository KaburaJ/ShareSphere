import React from 'react';
import { useNavigate } from 'react-router-dom';

const BackButton = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div>
      <button onClick={handleGoBack} style={{boxShadow:"2px 2px 2px 2px solid #ccc",  position: "sticky",
    top: "0", zIndex:"2"}}>
      <span>&larr;</span> Back
      </button>
    </div>
  );
};

export default BackButton;
