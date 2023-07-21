import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import SideBar from './navbar';
import './styles/homepage.css';
import { PostsContent } from './posts';
import FollowersPage from './followers';
import axios from 'axios';
import { Profile } from './profile';
import { Comments } from './comments';
import RightSideBar from './right-navbar';
import HowToGuide from './howTo';
import { useDarkMode } from './darkModeContext';

export const Homepage = () => {
    const [navbarIsOpen, setNavbarIsOpen] = useState(false);
    const [searchItem, setSearchItem] = useState('');
    const [isProfileVisible, setIsProfileVisible] = useState(false);
    const [showGuide, setShowGuide] = useState(true);
    const [darkMode] = useDarkMode();
    const [followersData, setFollowersData] = useState([]); // Define setFollowersData here
  

  
    const updateFollowersData = (newFollower) => {
      // Filter out the user's card from followersData when they follow someone
      setFollowersData((prevFollowersData) => prevFollowersData.filter((follower) => follower.UserID !== newFollower.UserID));
    };
  

  const toggleNavbar = (isOpen) => {
    setNavbarIsOpen(isOpen);
  };

  const handleSearchSubmit = () => {
    setIsProfileVisible(true);
  };

  useEffect(() => {
    const search = async () => {
      const searchData = {
        UserName: searchItem,
      };

      try {
        const response = await axios.post('http://localhost:5003/search', searchData, {
          withCredentials: true,
        });
        console.log(response);
      } catch (error) {
        console.error(error);
      }
    };

    search();
  }, [searchItem]);

  const handleCloseGuide = () => {
    setShowGuide(false);
  };

  return (
    <div className={`homepage ${darkMode ? 'homepage-dark-mode' : ''}`}>
      <div className="side-bar">
        <SideBar isOpen={navbarIsOpen} toggleNavbar={toggleNavbar} />
      </div>
      {/* {showGuide && <HowToGuide onClose={handleCloseGuide} />} */}

      <div
        style={{
          marginLeft: navbarIsOpen ? '2em' : '12em',
          transition: 'all 0.3s ease',
        }}
        className="middle-container"
      >
        <header className="header">
          <h1>Feed</h1>
          <h1>For You</h1>
        </header>
        <div className="comment-box">
        </div>
        <div className="posts">
          <div className="posts-content">
            {isProfileVisible ? <Profile /> : <PostsContent />}
          </div>
        </div>
      </div>
      <div className="right-side-bar">
        <div className="search">
          <input
            className="search-bar"
            type="search"
            placeholder="Search ShareSphere"
            value={searchItem}
            onChange={(e) => setSearchItem(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSearchSubmit();
              }
            }}
          />
        </div>
        <h2 className="suggestions-header">Who to follow...</h2>
        <div className="follow-suggestions">
          <div className="follow">
            {/* Pass the updateFollowersData callback to the FollowersPage component */}
            <FollowersPage updateFollowersData={updateFollowersData} />
          </div>
        </div>
      </div>
    </div>
  );
};
