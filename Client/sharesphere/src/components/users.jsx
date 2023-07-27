import React, { useState, useEffect } from 'react';
import './styles/users.css';
import axios from 'axios';
import profileImage from '../images/nature.jpg';
import BackButton from './back';
import { useDarkMode } from './darkModeContext';

export const Users = () => {
  const [myFollowers, setMyFollowers] = useState([]);
  const [darkMode] = useDarkMode()

  const viewFollowers = async () => {
    try {
      const response = await axios.get('http://localhost:5003/follower', {
        withCredentials: true,
      });
      setMyFollowers(response.data.results);
      console.log(response.data.results);
    } catch (error) {
      console.error('Error while retrieving user details:', error);
    }
  };

  useEffect(() => {
    viewFollowers();
  }, []);

  return (
    <div className=" container" style={darkMode ? { width:"650px", height:"100vh", backgroundColor: "black", color: "white" } : { }}>
      <BackButton />
      <div className="row" style={{ marginTop: "5%", marginLeft: '35%' }}>
        {myFollowers.map((follower, index) => (
          <div className="col-md-6 col-lg-4 g-mb-30" key={index}>
            <article className="u-shadow-v18 g-bg-white text-center rounded g-px-20 g-py-40 g-mb-5">
              {follower.profileimage ? (
                <img
                  className="d-inline-block img-fluid mb-4"
                  src={follower.profileimage}
                  alt={profileImage}
                />
              ) : (
                <img className="d-inline-block img-fluid mb-4" src={profileImage} alt={profileImage} />
              )}
              <h4 className="h5 g-color-black g-font-weight-600 g-mb-10">
                {follower.UserName}
              </h4>
              <p>{follower.ProfileDescription}</p>
            </article>
          </div>
        ))}
      </div>
    </div>
  );
};
