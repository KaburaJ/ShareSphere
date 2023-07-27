// Spinner.js
import React from 'react';
import './styles/spinner.css'
import { useDarkMode } from './darkModeContext';

const Spinner = () => {
const [darkMode] =useDarkMode()
  return (
    <div className="lds-dual-ring" style={darkMode ? { backgroundColor: "black", color: "white" } : { backgroundColor:"white" }}></div>
  );
};

export default Spinner;
