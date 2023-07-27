import React, { useEffect, useState } from 'react';
import { Routes, Route, useLocation, useParams } from 'react-router-dom';
import { Signup } from './components/signup';
import { Landing } from './components/landing';
import { Login } from './components/login';
import { Profile } from "./components/profile";
import { Posts } from "./components/postsUpload";
import FollowersPage from './components/followers';
import { Homepage } from './components/homepage';
import GoLiveController from './components/golive';
import MessagesPage from './components/messages';
import { Comments } from './components/comments';
import { Users } from './components/users';
import { UserActivity } from './components/userActivity';
import SettingsPage from './components/profilesettings';
import NotificationsPage from './components/notifications'
import NavBar from './components/navbar';
import SideBar from './components/otherBar';
import { SearchPage } from './components/searchPage';
import BasicInfoDialog from './components/basicInformation';
import { PostsContent } from './components/posts';
import SinglePost from './components/singlePost';
import { OtherProfile } from './components/otherProfile';
import { OtherUserActivity } from './components/otherUserActivity';
import { GeneralSettingsPage } from './components/settingsPage';
// import SinglePost from './components/singlePost';
import axios from 'axios'
import { Feed } from './components/UserFeed';

function App() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const [notificationsCount, setNotificationsCount] = useState(0);


  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  const fetchNotificationsCount = async () => {
    try {
      const response = await axios.get('http://localhost:5003/notificationscount', {
        withCredentials: true,
      });
      setNotificationsCount(response.data.results[0].UnreadNotificationsCount);
    } catch (error) {
      console.error('Error fetching notifications count:', error);
    }
  };

  useEffect(() => {
    fetchNotificationsCount();
  }, []); // Fetch the notifications count when the component mounts

  const updateNotificationsCount = () => {
    fetchNotificationsCount(); // Call the fetchNotificationsCount function to get the updated notifications count
  };

  const excludedPaths = ['/', '/login', '/signup'];

  const showNavBar = !excludedPaths.includes(location.pathname);



  return (
    <>
      {showNavBar && <NavBar isOpen={isOpen} toggleNavbar={toggleNavbar} notificationsCount={notificationsCount}/>}
      {showNavBar && <SideBar style={{ position: "absolute" }} isOpen={isOpen} toggleNavbar={toggleNavbar} />}
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile/>} />
        <Route path="/posts" element={<Posts />} />
        <Route path="/home" element={<Homepage />} />
        <Route path="/home/followers" element={<FollowersPage />} />
        <Route path='/share' element={<Posts />} />
        <Route path='/golive' element={<GoLiveController />} />
        <Route path='/notifications' element={<NotificationsPage updateNotificationsCount={updateNotificationsCount}/>}/>
        <Route path='/messages' element={<MessagesPage/>}/>
        <Route path='/users' element={<Users/>}/>
        <Route path='/activity' element={<UserActivity/>}/>
        <Route path='/activity/:userid' element={<OtherUserActivity/>}/>
        <Route path='/profilesettings' element={<SettingsPage/>}/>
        <Route path='/settings' element={<GeneralSettingsPage/>}/>
        {/* <Route path='/commentsu' element={<CommentsUpload/>}></Route> */}
        <Route path='/comments' element={<Comments/>}></Route>
        <Route path='/home/post/:postId' element={<SinglePost/>} />
        <Route path='/search' element={<SearchPage/>}></Route>
        <Route path='/home/feed' element={<Feed/>}></Route>
        <Route path='/basicinfo' element={<BasicInfoDialog/>}/>
        <Route path='/explore' element={<SearchPage/>}/>
        <Route path='/profile/:username' element={<OtherProfile/>}/>
      </Routes>
    </>
  );
}

export default App;
