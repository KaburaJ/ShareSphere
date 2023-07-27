import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { NavLink } from 'react-router-dom';
import { faBars, faHome, faSearch, faBell, faMessage } from '@fortawesome/free-solid-svg-icons';
import './styles/navbar.css';
import logo from '../images/sharelogo.png';
import { useDarkMode } from './darkModeContext';
import axios from 'axios';

function NavBar({ isOpen, toggleNavbar, notificationsCount }) {
  const [darkMode] = useDarkMode();

  const handleIconClick = () => {
    toggleNavbar(!isOpen);
  };

  const fetchNotificationsCount = async () => {
    try {
      const response = await axios.get('http://localhost:5003/notificationscount', {
        withCredentials: true,
      });
      notificationsCount(response.data.results[0].UnreadNotificationsCount);
    } catch (error) {
      console.error('Error fetching notifications count:', error);
    }
  };

  useEffect(() => {
    fetchNotificationsCount(); // Fetch the notifications count when the component mounts
  }, []);

  return (
    <div className={`NavBar ${darkMode ? 'navbar-dark-mode' : ''}`}>
      <NavLink to="/home" activeClassName="active">
        <h1 style={{ color: "#e83d95", letterSpacing: ".2em", fontSize: "xx-large", marginTop: ".1em" }}>ShareSphere</h1>
      </NavLink>

      <div className="nav-links">
        <NavLink to="/explore" activeClassName="active">
          <FontAwesomeIcon icon={faSearch} />
        </NavLink>
        <NavLink to="/notifications" activeClassName="active">
          <FontAwesomeIcon icon={faBell} />
          {notificationsCount > 0 && <span className="notifications-count">{notificationsCount}</span>}
        </NavLink>
        <NavLink to="/messages" activeClassName="active">
          <FontAwesomeIcon icon={faMessage} />
        </NavLink>
      </div>
    </div>
  );
}

export default NavBar;
