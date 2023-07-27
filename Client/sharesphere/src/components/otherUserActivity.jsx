import React, { useState, useEffect } from 'react';
import './styles/activity.css';
import axios from 'axios';
import SideBar from './navbar';
import { useNavigate, useParams } from 'react-router-dom';
import BackButton from './back';
import { useDarkMode } from './darkModeContext';

export const OtherUserActivity = () => {

  const userId = useParams();
  console.log(userId);
  const [myActivity, setMyActivity] = useState([]);
  const navigate = useNavigate();
  const [darkMode] = useDarkMode()

  const viewFollowers = async (userid) => {
    try {
      const response = await axios.get(`http://localhost:5003/activity/${userId.userid}`, {
        withCredentials: true,
      });
      setMyActivity(response.data.results);
      console.log(response.data.results);
    } catch (error) {
      console.error('Error while retrieving user activity:', error);
    }
  };

  useEffect(() => {
    viewFollowers();
  }, []);

  const handleActivityItemClick = (postId) => {
    navigate(`/post/${postId}`);
  };

  return (
    <>
      <div className="container"> style={darkMode ? { backgroundColor: "black", color: "white", height:"100vh" } : { backgroundColor:"#F4E4EC", height:"100vh"  }}
        <BackButton />
        <div className="activity-container">
          {myActivity.map((activityItem) => (
            <div
              key={activityItem.ItemID}
              className="activity-item"
              onClick={() => handleActivityItemClick(activityItem.PostID)}
            >
              {activityItem.ItemType === "Reply" && (
                <div className="reply">
                  <h4 className="activity-title">Reply</h4>
                  <p className="activity-content">{activityItem.ItemContent||'Nothing to see here'}</p>
                  <p className="activity-date">Date: {activityItem.ItemDate}</p>
                </div>
              )}
              {activityItem.ItemType === "Post" && (
                <div className="post">
                  <h4 className="activity-title">Post</h4>
                  <p className="activity-content">{activityItem.ItemContent||'Nothing to see here'}</p>
                  <p className="activity-date">Date: {activityItem.ItemDate}</p>
                </div>
              )}
              {activityItem.ItemType === "Comment" && (
                <div className="comment">
                  <h4 className="activity-title">Comment</h4>
                  <p className="activity-content">{activityItem.ItemContent||'Nothing to see here'}</p>
                  <p className="activity-date">Date: {activityItem.ItemDate}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
