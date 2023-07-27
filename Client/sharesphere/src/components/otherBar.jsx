import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { NavLink } from 'react-router-dom';
import { 
  faCamera,
  faShare,
  faGear,
  faPersonCirclePlus
} from '@fortawesome/free-solid-svg-icons';
import './styles/sidebar.css';
import { useDarkMode } from './darkModeContext';

function SideBar({ children, isOpen, toggleNavbar }) {
  const menuItem = [
    {
      path: "/golive",
      name: "Go Live",
      icon: <FontAwesomeIcon icon={faCamera}/>,
    },
    {
      path: "/settings",
      name: "Settings",
      icon: <FontAwesomeIcon icon={faGear}/>,
    },
    {
      path: "/profile",
      name: "Profile",
      icon: <FontAwesomeIcon icon={faPersonCirclePlus}/>,
    },
    {
      path: "/share",
      icon: <button><h1 style={{fontSize:"large",fontWeight:"normal", marginTop:"-.2em"}}>Share</h1></button>,
    }
  ]
  const [darkMode] = useDarkMode();

  return (
    <div className={`SideBar ${isOpen ? 'open' : 'closed'} ${darkMode ? 'navbar-dark-mode' : ''}`}>
      {menuItem.map((item, index) => (
        <NavLink
          to={item.path}
          key={index}
          activeclassName="active"
        >
          {item.icon}
          <span>{item.name}</span>
        </NavLink>
      ))}
      {/* <div className="saved-posts">
      <h1>Saved Posts</h1>
      </div> */}
    </div>
  );
}

export default SideBar;
