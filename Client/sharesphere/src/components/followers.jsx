import React, { useState, useEffect } from 'react';
import './styles/followers.css';
import image1 from '../images/imgy-removebg-preview.png';
import axios from 'axios';
import { useDarkMode } from './darkModeContext';
import Spinner from './spinner';

const FollowersPage = ({ updateFollowersData }) => {
  const [followersData, setFollowersData] = useState([]);
  const [followID, setFollowID] = useState([]);
  const [popUp, setPopUp] = useState('');
  const [loading, setLoading] = useState(true); // Add loading state
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
      setFollowersData(response.data);
      setLoading(false); // Data fetching is done, set loading to false
    } catch (error) {
      console.error('Error fetching followers data:', error);
      setLoading(false); // Data fetching failed, set loading to false
    }
  };

  const getUserID = async (follower) => {
    const data = {
      "UserName": follower.UserName,
    };
  
    try {
      const response = await axios.post(
        'http://localhost:5003/userid',
        data,
        {
          withCredentials: true,
        }
      );
      const followedID = response.data.results.recordset[0].UserID; // Use 'UserID' instead of 'FollowedID'
      setFollowID(followedID.toString()); // Convert to string and set the followID state
      console.log(followedID); // Make sure you get the correct UserID here
    } catch (error) {
      console.log('Error getting user ID:', error);
    }
  };
  

  const followUser = async (follower) => {
    try {
      await getUserID(follower);
      const followData = {
        followedID: followID, // Use 'followedID' as the property name, not 'FollowedID'
      };
  
      const response = await axios.post(
        'http://localhost:5003/follow',
        followData,
        {
          withCredentials: true,
        }
      );
  
      // Filter out the followed user from the followersData state
      setFollowersData((prevFollowersData) => {
        return prevFollowersData.filter((user) => user.UserID !== follower.UserID);
      });
  
      // Call the updateFollowersData function with the follower object to update the homepage
      updateFollowersData(follower);
  
      console.log(response);
    } catch (error) {
      console.log('Error following user:', error);
    }
  };
  


  return (
    <div className="followers-page" style={darkMode ? { backgroundColor: "black", color: "white", height:"100vh" } : { backgroundColor:"white", height:"100vh"  }}>
       <div className="followers-list">
        {loading ? ( // Show a loading indicator while data is being fetched
          <Spinner/>
        ) : (
          followersData.map((follower) => (
            <div className="follower-card" key={follower.UserID}>
            <div className="profile-image">
              <img src={image1} alt={follower.UserName} style={{ backgroundColor: "#f4e4ec" }} />
            </div>
            <div className="card-content">
              <h3 style={{ fontSize: "medium", marginTop: "1em", fontWeight: "bold" }}>{follower.UserName}</h3>
              <button className="follow-button" type='submit' onClick={() => followUser(follower)} style={{ marginLeft: "20em" }}>
                Follow
              </button>
            </div>
          </div>
        )))}
      </div>
    </div>
  );
};

export default FollowersPage;
