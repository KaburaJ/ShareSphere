import React, { useEffect, useState } from 'react';
import './styles/profile.css';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useDarkMode } from './darkModeContext';
import profileImg from '../images/avartar.png';

export const OtherProfile = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const { darkMode } = useDarkMode();

  const [profile, setProfile] = useState(null);
  const [postsCount, setPostsCount] = useState(0);
  const [followers, setFollowers] = useState(0);
  const [following, setFollowing] = useState(0);
  const [followersN, setFollowersN] = useState(0);
  const [followingN, setFollowingN] = useState(0);
  const [postsCountN, setPostsCountN] = useState(0);
  const [userID, setUserID] = useState('');
  const [isFollowing, setIsFollowing] = useState(false);


    // Check if the logged-in user is following the displayed user
    const checkFollowStatus = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5003/check-follow/${userID}`,
          { withCredentials: true }
        );
        setIsFollowing(response.data.isFollowing);
      } catch (error) {
        console.error('Error while checking follow status:', error);
      }
    };


  const updateFollowStatus = (isFollowing) => {
    localStorage.setItem('isFollowing', JSON.stringify(isFollowing));
  };

  useEffect(() => {
    // Check if the logged-in user is following the displayed user from local storage
    const storedFollowStatus = localStorage.getItem('isFollowing');
    if (storedFollowStatus !== null) {
      setIsFollowing(JSON.parse(storedFollowStatus));
    } else {
      // If no status found in local storage, check the follow status from the server
      checkFollowStatus();
    }
  }, [userID]);

  const handleFollowUnfollow = async () => {
    try {
      // Send a request to follow/unfollow the displayed user
      const response = await axios.post(
        `http://localhost:5003/${isFollowing ? 'unfollow' : 'follow'}`,
        { userID },
        { withCredentials: true }
      );

      // Update the UI and state based on the response
      if (response.data.success) {
        setIsFollowing((prevIsFollowing) => !prevIsFollowing);
        updateFollowStatus(!isFollowing); // Update local storage
        // You can also update the followers count on the UI if needed
      } else {
        console.error('Failed to follow/unfollow user.');
      }
    } catch (error) {
      console.error('Error while following/unfollowing user:', error);
    }
  };
  const fetchUserData = async (username) => {
    try {
      const response = await axios.get(`http://localhost:5003/profile/${username}`, {
        withCredentials: true,
      });

      const profileData = response.data.results.recordsets[0]?.[0]; // Get the first element from the array
      console.log('Profile Data:', profileData);

      // Update the states with the fetched data
      setProfile(profileData);
      setPostsCount(profileData?.PostsCount);
      setFollowers(profileData?.FollowersCount);
      setFollowing(profileData?.FollowingCount);
    } catch (error) {
      console.error('Error fetching other user profile:', error);
      // If profile data is not available, set default values
      setProfile(null);
      setPostsCount(0);
      setFollowers(0);
      setFollowing(0);
    }
  };

  useEffect(() => {
    fetchUserData(username);
  }, [username]);

  useEffect(() => {
    // Fetch user metrics for the current user
    if (userID) {
      getFollowers(userID);
      getFollowing(userID);
      getPostsCount(userID);
    }
  }, [userID]);

  const getUserID = async (username) => {
    const data = {
      UserName: username,
    };

    try {
      const response = await axios.post(
        'http://localhost:5003/userid',
        data,
        {
          withCredentials: true,
        }
      );
      setUserID(response.data.results.recordset[0].UserID);
    } catch (error) {
      console.log('Error getting user ID:', error);
    }
  };

  useEffect(() => {
    getUserID(username);
  }, [username]);

  const getFollowers = async (userID) => {
    try {
      const response = await axios.get(`http://localhost:5003/followers/${userID}`, {
        withCredentials: true,
      });
      setFollowersN(response.data.results[0].FollowerCount);
      console.log(`followers: ${response.data.results[0].FollowerCount}`);
    } catch (error) {
      console.error('Error while counting followers:', error);
    }
  };

  const getFollowing = async (userID) => {
    try {
      let response = await axios.get(`http://localhost:5003/following/${userID}`, {
        withCredentials: true,
      });
      setFollowingN(response.data.results[0].FollowerCount);
    } catch (error) {
      console.error('Error while counting following:', error);
    }
  };

  const getPostsCount = async (userID) => {
    try {
      let response = await axios.get(`http://localhost:5003/postscount/${userID}`, {
        withCredentials: true,
      });
      setPostsCountN(response.data.results[0].PostCount);
    } catch (error) {
      console.error('Error while counting posts:', error);
    }
  };

  const handleUserActivity = () => {
    // Navigate to the activity page using the user ID
    navigate(`/activity/${userID}`);
  };

  const handleFollowers = async () => {
    try {
      // Handle followers logic here
    } catch (error) {}
  };

  const handleMessage = async () => {
    try {
      // Handle message logic here
    } catch (error) {}
  };

  return (
    <div style={darkMode ? { backgroundColor: 'black', color: 'white', marginTop: '-1em' } : {}}>
      <div className={`profile ${darkMode ? 'profile-dark-mode' : ''}`}>
        <div className="signup">
          <div className="profile-container">
            <div className="profile-header"></div>
            <div className="profile-pic">
              <img
                src={profile?.ProfileImage || profileImg}
                style={{ position: 'absolute', borderRadius: '50%', width: '12em', height: '12em', marginTop: '-11em' }}
                alt="Profile"
              />
            </div>
            <div className="profile-details">
              <h1>{profile?.UserName || username}</h1>
              {profile ? (
                <>
                  {/* Display main metrics for users with profile */}
                  <p className="title" style={{ marginBottom: '.5em' }}>
                    {profile.ProfileDescription}
                    {console.log(profile)}
                  </p>
                  <div>
                    <button onClick={handleMessage} className="profile-button">
                      Message
                    </button>
                  </div>
                  <div className="horizontal-fields" style={{ marginTop: '1em' }}>
                    <div className="field">
                      <h2>{postsCount}</h2>
                      <p>Posts</p>
                    </div>
                    <div className="field">
                      <h2>{followers}</h2>
                      <p>Followers</p>
                    </div>
                    <div className="field">
                      <h2>{following}</h2>
                      <p>Following</p>
                    </div>
                  </div>
                  <div className="profile-metrics" style={{ borderTop: '1px solid #ccc', paddingTop: '1em' }}>
                    <button onClick={handleUserActivity} className="profile-button">
                      View activity
                    </button>
                    <button onClick={handleFollowers} className="profile-button">
                      Relationships
                    </button>
                  </div>
                </>
              ) : (
                <>
                  {/* Display additional metrics for users without profile */}
                  <p className="title" style={{ marginBottom: '.5em' }}>
                    This user does not have a bio yet
                  </p>
                  <div className="horizontal-fields" style={{ marginTop: '1em' }}>
                    <div className="field">
                      <h2>{postsCountN}</h2>
                      <p>Posts</p>
                    </div>
                    <div className="field">
                      <h2>{followersN}</h2>
                      <p>Followers</p>
                    </div>
                    <div className="field">
                      <h2>{followingN}</h2>
                      <p>Following</p>
                    </div>
                  </div>
                  <div className="profile-metrics" style={{ borderTop: '1px solid #ccc', paddingTop: '1em' }}>
                  <button onClick={handleFollowUnfollow} className="profile-button">
                      {isFollowing ? 'Unfollow' : 'Follow'}
                    </button>
                    <button onClick={handleUserActivity} className="profile-button">
                      View activity
                    </button>
                    <button onClick={handleFollowers} className="profile-button">
                      Relationships
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};