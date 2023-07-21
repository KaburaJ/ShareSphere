import React, { useState } from 'react';
import Modal from 'react-modal';

const LogoutDialog = ({ onClose, onConfirm }) => {
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm(password);
    setPassword('');
  };

  return (
    <Modal
      isOpen={true}
      onRequestClose={onClose}
      contentLabel="Logout Dialog"
      style={{
        overlay: {
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        },
        content: {
          maxWidth: '300px',
          height: '30vh',
          margin: 'auto',
        },
      }}
    >
      <div className="logout">
        <h1>Enter your password</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{marginLeft:"40px", borderRadius:"10px", height:"40px"}}
          />
          <button type="submit" style={{backgroundColor:"red", marginLeft:"30px", marginTop:"1em",marginRight:"1em"}}>Confirm</button>
          <button onClick={onClose} style={{backgroundColor:"green"}}>Cancel</button>
        </form>
      </div>
    </Modal>
  );
};

export default LogoutDialog;
