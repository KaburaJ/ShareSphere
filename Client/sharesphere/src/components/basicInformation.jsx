import React from 'react';
import Modal from 'react-modal';
import { useDarkMode } from './darkModeContext';

const BasicInfoDialog = ({ onClose, details }) => {
  const [darkMode] = useDarkMode()
  return (
    <Modal
      isOpen={true}
      onRequestClose={onClose}
      contentLabel="Basic Info Dialog"
      style={{
        overlay: {
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        },
        content: {
          maxWidth: '300px',
          height: '40vh',
          margin: 'auto',
        },
      }}
    >
      <div className="basic-info-dialog" style={darkMode ? { backgroundColor: "black", color: "white", height:"100vh" } : { backgroundColor:"#F4E4EC", height:"100vh" }}>
        <h1>Basic Information</h1>
        <p className="title">First Name: <span className="profile-info-details">{details.FirstName}</span></p>
        <p className="title">Last Name: <span className="profile-info-details">{details.LastName}</span></p>
        <p className="title">Age: <span className="profile-info-details">{details.UserAge}</span></p>
        <p className="title">Email Address: <span className="profile-info-details">{details.UserEmail}</span></p>
        <p className="title">Date Joined: <span className="profile-info-details">{details.timestamp ? details.timestamp.slice(0, 10) : ""}</span></p>
        <button onClick={onClose} style={{ backgroundColor: "green" }}>Close</button>
      </div>
    </Modal>
  );
};

export default BasicInfoDialog;
