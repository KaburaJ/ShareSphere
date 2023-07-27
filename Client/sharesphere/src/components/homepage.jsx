import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import SideBar from './otherBar';
import './styles/homepage.css';
import { PostsContent } from './posts';
import FollowersPage from './followers';
import axios from 'axios';
import { Profile } from './profile';
import { Comments } from './comments';
import HowToGuide from './howTo';
import { useDarkMode } from './darkModeContext';
import NavBar from './navbar';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { Feed } from './UserFeed';

export const Homepage = () => {
    const [navbarIsOpen, setNavbarIsOpen] = useState(false);
    const [isProfileVisible, setIsProfileVisible] = useState(false);
    const [showGuide, setShowGuide] = useState(true);
    const [darkMode] = useDarkMode();
    const [followersData, setFollowersData] = useState([]); // Define setFollowersData here
    const [activePage, setActivePage] = useState('For You');
  
    const handleForYouClick = () => {
      setActivePage('For You'); // Set active page to "For You"
    };
  
    const handleFeedClick = () => {
      setActivePage('Feed'); // Set active page to "Feed"
    };
  

  
    const updateFollowersData = (newFollower) => {
      // Filter out the user's card from followersData when they follow someone
      setFollowersData((prevFollowersData) => prevFollowersData.filter((follower) => follower.UserID !== newFollower.UserID));
    };
  

  const toggleNavbar = (isOpen) => {
    setNavbarIsOpen(isOpen);
  };


  const handleCloseGuide = () => {
    setShowGuide(false);
  };

  return (
    <>
      <div className="homepage" style={darkMode ? { backgroundColor: "black", color: "white", height:"100vh" } : { backgroundColor:"#F4E4EC", height:"100vh"  }}>
        {/* {showGuide && <HowToGuide onClose={handleCloseGuide} />} */}

        <div
          style={{
            marginLeft: navbarIsOpen ? '2em' : '12em',
            transition: 'all 0.3s ease',
          }}
          className="middle-container"
          
        >
          <header className="header">
          <h1 onClick={handleFeedClick} className={activePage === 'Feed' ? 'active' : ''}>Feed</h1>
          <h1 onClick={handleForYouClick} className={activePage === 'For You' ? 'active' : ''}>For You</h1>
          </header>
          <div className="posts"  style={darkMode? {backgroundColor:"black", color: "white"}: {backgroundColor:"#f4e4ec", color:"black"}}>
          <div className="posts-content">
            {isProfileVisible ? <Profile /> : activePage === 'For You' ? <PostsContent /> : <Feed />}
          </div>
          </div>
        </div>
        <div style={{ backgroundColor: "#F9FAFC" }}>
        <div className="right-side-bar">
          <h2 className="suggestions-header">Who to follow...</h2>
          <div className="follow-suggestions">
            <div className="follow">
              {/* Pass the updateFollowersData callback to the FollowersPage component */}
              <FollowersPage updateFollowersData={updateFollowersData} />
            </div>
          </div>

          {/* Footer in the right sidebar */}
          <div className="footer">
            <p>Contact Us: sharesphere@gmail.com</p>
            <p>Follow Us: 
              <a href="https://www.facebook.com/example" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-facebook"></i>
              </a>
              <a href="https://www.twitter.com/example" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="https://www.instagram.com/example" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-instagram"></i>
              </a>
            </p>
          </div>
        </div>
      </div>
      </div>
    </>
  );
};