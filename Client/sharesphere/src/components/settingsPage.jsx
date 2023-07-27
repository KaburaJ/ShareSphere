import React, { useState } from 'react';
import './styles/settingsPage.css';
import SideBar from './navbar';
import { useDarkMode } from './darkModeContext';

export const GeneralSettingsPage = () => {
  const [darkMode, setDarkMode] = useDarkMode();
  const [notifications, setNotifications] = useState(true);
  const [language, setLanguage] = useState('en');

  const handleToggleDarkMode = () => {
    setDarkMode((prevDarkMode) => !prevDarkMode);
  };

  const handleToggleNotifications = () => {
    setNotifications((prevNotifications) => !prevNotifications);
  };

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
  };

  return (
    <div style={darkMode ? { marginTop:"-1em", backgroundColor: "black", color: "white"} : {backgroundColor:"#F4E4EC", height:"100vh", marginTop:"-1em"}}>
    <div className={`settings-page ${darkMode ? 'dark-mode' : ''}`}>
      <h1>Settings</h1>
      <div className="settings-option">
        <p>Dark Mode</p>
        <label className="switch">
          <input type="checkbox" checked={darkMode} onChange={handleToggleDarkMode} />
          <span className="slider round"></span>
        </label>
      </div>
      <div className="settings-option">
        <p>Notifications</p>
        <label className="switch">
          <input type="checkbox" checked={notifications} onChange={handleToggleNotifications} />
          <span className="slider round"></span>
        </label>
      </div>
      <div className="settings-option">
        <p>Language</p>
        <select value={language} onChange={handleLanguageChange}>
          <option value="en">English</option>
          <option value="es">Spanish</option>
          <option value="fr">French</option>
        </select>
      </div>
    </div>
    </div>
  );
};
