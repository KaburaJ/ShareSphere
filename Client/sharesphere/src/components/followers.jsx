import React, { useState, useEffect } from 'react';
import './styles/followers.css';
import image1 from '../images/wallp1.jpg';
import axios from 'axios';
import { useDarkMode } from './darkModeContext';

const FollowersPage = ({ updateFollowersData }) => {
  const [followersData, setFollowersData] = useState([]);
  const [followID, setFollowID] = useState([]);
  const [popUp, setPopUp] = useState('');
  const [darkMode] = useDarkMode();

  const showPopUp = (message) => {
    setPopUp({
      message,
      show: true,
    });
  };
  
  const hidePopUp = () => {
    setPopUp({
      message: '',
      show: false,
    });
  };
  

  useEffect(() => {
    fetchFollowersData();
  }, []);

  const fetchFollowersData = async () => {
    try {
      const response = await axios.get('http://localhost:5003/allusers', {
        withCredentials: true,
      });
      console.log('All users:', response.data);
      setFollowersData(response.data);
    } catch (error) {
      console.error('Error fetching followers data:', error);
    }
  };

  const getUserID = async (follower) => {
    const data = {
      "UserName": follower.UserName,
    };
    console.log(typeof(follower.UserName));
    try {
      const response = await axios.post(
        'http://localhost:5003/userid',
         data ,
        {
          withCredentials: true,
        }
      );
setFollowID(response.data.results.recordset[0].UserID);
console.log(response.data.results.recordset[0].UserID);

    } catch (error) {
      console.log('Error getting user ID:', error);
    }
  };
  

const followUser = async (follower) => {
  await getUserID(follower);
  const followData = {
    FollowedID: followID.FollowedID, // Pass FollowedID as a string
  };

  try {
    const response = await axios.post(
      'http://localhost:5003/follow',
      followData,
      {
        withCredentials: true,
      }
    );

    // Show the popup
    showPopUp(response.data.message);

    updateFollowersData(follower);
    console.log(response);
  } catch (error) {
    console.log('Error following user:', error);
  }
};



  

  return (
    <div className={`followers-page ${darkMode? `followers-page-darkmode`:''}`}>
      <div className="followers-list">
        {followersData.flatMap((follower) => (
          <div className="follower-card" key={follower.UserID}>
            <div className="profile-image">
              <img src={image1} alt={follower.UserName} />
            </div>
            <div className="card-content">
              <h2>{follower.UserName}</h2>
              <button className="follow-button" onClick={() => followUser(follower)}>
                Follow
              </button>
            </div>
          </div>
        ))}
      </div>
      {/* {popUp.show && (
      <div className="popup show">
        <p>{popUp.message}</p>
      </div>
    )} */}
    </div>
  );
};

export default FollowersPage;
