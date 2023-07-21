import React from 'react';
import GoLive from './goliveprep';
import './styles/golive.css'
import SideBar from './navbar';
import BackButton from './back';
import { useDarkMode } from './darkModeContext';

const GoLiveController = () => {
  const roomId = 'your-room-id'; // Replace with the actual room ID
  const [darkMode] = useDarkMode()

  return (
    <>
    <SideBar/>
    <div className={`golive ${darkMode ? `golive-darkmode`: ''}`} style={{marginLeft:"20%"}}>
      <BackButton/>
      <h1>Go Live</h1>
      <GoLive roomId={roomId} />
    </div>
    </>
  );
};

export default GoLiveController;
