import axios from 'axios';
import React, { useEffect, useState } from 'react';
import './styles/searchPage.css';
import profile from '../images/avartar.png';
import { useNavigate } from 'react-router-dom';
import { useDarkMode } from './darkModeContext';
import Spinner from './spinner';


export const SearchPage = () => {
  const [searchItem, setSearchItem] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isProfileVisible, setIsProfileVisible] = useState(false);
  const [people, setPeople] = useState([]);
  const navigate = useNavigate()
  const [darkMode] = useDarkMode()
  const [loading, setLoading]= useState(true);
  
  const [followersData, setFollowersData] = useState([]);

  useEffect(() => {
    const getFollowersData = async () => {
      try {
        const response = await axios.get('http://localhost:5003/follower', {
          withCredentials: true,
        });
        if (Array.isArray(response.data.results)) {
          setFollowersData(response.data.results);
          console.log('Followers Data:', response.data.results); // Check followers data from the API
        } else {
          setFollowersData([]); // Set an empty array if response.data.results is not an array
        }
      } catch (error) {
        console.error(error);
      }
    };

    getFollowersData();
  }, []);
  
  const isUserFollowed = (userId) => {
    return followersData.some((follower) => follower.FollowerID === userId);
  };

  const handleFollowUnfollow = async (userId, isFollowed) => {
    try {
      const response = await axios.post(
        'http://localhost:5003/follow-unfollow',
        { userId, isFollowed },
        { withCredentials: true }
      );

      // Handle the response based on success/failure
      if (response.data.success) {
        // Update the followersData state
        if (isFollowed) {
          setFollowersData((prevFollowersData) =>
            prevFollowersData.filter((follower) => follower.FollowerID !== userId)
          );
        } else {
          setFollowersData((prevFollowersData) => [
            ...prevFollowersData,
            { FollowerID: userId, FollowerUserName: 'current_user' },
          ]);
        }
      } else {
        console.error('Failed to follow/unfollow user.');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearchSubmit = () => {
    setIsProfileVisible(true);
  };

  useEffect(() => {
    const getAllPeople = async () => {
      try {
        const response = await axios.get('http://localhost:5003/people', {
          withCredentials: true
        });
        if (Array.isArray(response.data.results)) {
          setPeople(response.data.results);
          console.log('People:', response.data.results); // Check people data from the API
        } else {
          setPeople([]); // Set an empty array if response.data.results is not an array
        }
      } catch (error) {
        console.error(error);
      }
    };

    getAllPeople();
  }, []);

  useEffect(() => {
    const search = async () => {
      const searchData = {
        UserName: searchItem,
      };

      try {
        const response = await axios.post('http://localhost:5003/search', searchData, {
          withCredentials: true,
        });
        setSearchResults(response.data.results); // Update the searchResults state with the API response
        setLoading(false)
        console.log('Search Results:', response.data.results); // Check search results data from the API
      } catch (error) {
        console.error(error);
      }
    };

    search();
  }, [searchItem]);

  console.log('Render:', people);

  const handleCardClick = (username) =>{
    navigate(`/profile/${username}`)
  }

  return (
    <div style={darkMode ? { backgroundColor: "black", color: "white", height:"100vh" } : { backgroundColor:"#F4E4EC", height:"100vh"  }}>
    <div style={{ backgroundColor: "#F4E4EC", height: "100vh" }}>
      <div className={`search ${darkMode ? 'search' : ''}`}>
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
      {/* Display search results */}
      <div className="user-cards-container">
        <h2 style={{ marginLeft: ".8em" }}>{isProfileVisible ? 'Search Results:' : 'Explore Users:'}</h2>
        <div className="user-cards">
    {loading ? ( // Show a loading indicator while data is being fetched
      <Spinner/>
    ) : (
      isProfileVisible
      ? searchResults.map((result) => (
          <div key={result.id} className="user-card">
            {/* Customize the card to your liking */}
            <div className="card-content">
              <img src={result.ProfileImage || profile} alt="Profile" />
              <p>{result.UserName}</p>
              {isUserFollowed(result.id) ? (
                <button onClick={() => handleFollowUnfollow(result.id, true)}>Unfollow</button>
              ) : (
                <button onClick={() => handleFollowUnfollow(result.id, false)}>Follow</button>
              )}
            </div>
          </div>
        ))
      : searchResults.map((result) => (
          <div key={result.id} className="user-card" onClick={() => handleCardClick(result.UserName)}>
            {/* Customize the card to your liking */}
            <div className="card-content">
              <img src={result.ProfileImage || profile} alt="Profile" />
              <p>{result.UserName}</p>
              {isUserFollowed(result.id) ? (
                <button onClick={() => handleFollowUnfollow(result.id, true)}>Unfollow</button>
              ) : (
                <button onClick={() => handleFollowUnfollow(result.id, false)}>Follow</button>
              )}
            </div>
          </div>
        ))
    )}
  </div>
</div>
    </div>
    </div>
  );
};