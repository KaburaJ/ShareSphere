import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faHome } from '@fortawesome/free-solid-svg-icons';
import { NavLink } from 'react-router-dom';
import { 
  faSearch,
  faBell,
  faMessage,
  faCamera,
  faShare,
  faGear,
  faPersonCirclePlus
} from '@fortawesome/free-solid-svg-icons';
import './styles/navbar.css';
import logo from '../images/sharelogo.png';
import ProfilePic from '../images/profile-pic-removebg-preview.png'
import { Profile } from './profile';
import Posts from './postsUpload';
import { PostsContent } from './posts';
import { useDarkMode } from './darkModeContext';

function SideBar({ children, isOpen, toggleNavbar }) {
  const menuItem = [
    {
      path: "/home",
      name: "Home",
      icon: <FontAwesomeIcon icon={faHome}/>
    },
    {
      path: "/explore",
      name: "Explore",
      icon: <FontAwesomeIcon icon={faSearch}/>,
    },
    {
      path: "/notifications",
      name: "Notifications",
      icon: <FontAwesomeIcon icon={faBell}/>
    },
    {
      path: "/messages",
      name: "Messages",
      icon: <FontAwesomeIcon icon={faMessage}/>,
    },
    {
      path: "/golive",
      name: "GoLive",
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
      icon: <button style={{width:"9em", fontSize:"large"}} placeholder='share'>Share</button>,
      
    }

  ]

  const [showProfileContent, setShowProfileContent] = useState(false);
  const [darkMode ]= useDarkMode()
  

  const handleIconClick = () => {
    toggleNavbar(!isOpen);
  };

  const handleProfileClick = () => {
    setShowProfileContent(!showProfileContent);
  };

  return (
    <div className="navy">
       {/* <img style={{display: isOpen? "none": "block"}} className="logo" src={logo} alt="ShareSphere Logo" /> */}
       <div className={`navbar ${isOpen ? 'open' : 'closed'} ${darkMode ? 'navbar-dark-mode' : ''}`}>
        <FontAwesomeIcon
          icon={faBars}
          onClick={handleIconClick}
          className="FontAwesomeIcon"
        />
        {menuItem.map((item, index) => (
          <NavLink
            style={{ width: isOpen ? "1.8em" : "4.4em", transition: "all 0.4s ease"}}
            to={item.path}
            key={index}
            className="navbar-list"
            activeclassName="active"
          >
            <div className='icon'>
              <h2>{item.icon}</h2>
            </div>
            <div className="text">
              <h1 style={{ display: isOpen ? "none" : "block" }}>{item.name}</h1>
            </div>
            
          </NavLink>
          
        ))}

        <main>{children}</main>
      </div>
    </div>
  );
}

export default SideBar;

