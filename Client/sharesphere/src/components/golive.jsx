import React, { useState } from 'react';
import './styles/golive.css';
import SideBar from './navbar';
import BackButton from './back';
import { useDarkMode } from './darkModeContext';
import GoLive from './goliveprep';


const GoLiveController = () => {
  const roomId = 'your-room-id'; // Replace with the actual room ID
  const [darkMode] = useDarkMode();
  const [isCopied, setIsCopied] = useState(false);
  const [isLiveStarted, setIsLiveStarted] = useState(false); 
  const [searchTerm, setSearchTerm] = useState('');



  
// Function to copy the room ID to the clipboard
const copyRoomIdToClipboard = () => {
  const textarea = document.createElement('textarea');
  textarea.value = roomId;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  document.body.removeChild(textarea);
  setIsCopied(true);
  setIsLiveStarted(true); // Set the live share started to true after copying the room ID
};

  return (
    <>
      <div className={`golive ${darkMode ? 'golive-darkmode' : ''}`} style={{ marginLeft: '20%' }}>
        <BackButton />
        <h1>Go Live</h1>
        <div className="room-id-container">
          <p>Room ID: {roomId}</p>
          {!isCopied && (
            <button onClick={copyRoomIdToClipboard} className="golive-button copy-btn">
              Copy Room ID
            </button>
          )}
          {isCopied && <span>Room ID copied to clipboard!</span>}
        </div>

        {/* Search Bar for inviting people */}
        {isLiveStarted && (
          <div className="search-bar-container">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search for people to invite..."
              className="search-bar"
            />
            <button className="golive-button invite-btn">Invite</button>
          </div>
        )}
      </div>

      {isLiveStarted && <GoLive roomId={roomId} />}
    </>
  );
};

export default GoLiveController;