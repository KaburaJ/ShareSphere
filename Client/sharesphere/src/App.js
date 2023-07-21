import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Signup } from './components/signup';
import { Landing } from './components/landing';
import { Login } from './components/login';
import { Profile } from "./components/profile";
import { Posts } from "./components/postsUpload";
import FollowersPage from './components/followers';
import { Homepage } from './components/homepage';
import GoLiveFunctionality from './components/golive';
import GoLiveController from './components/golive';
import NotificationsPage from './components/notifications';
import MessagesPage from './components/messages';
import { Comments } from './components/comments';
// import { CommentsUpload } from './components/commentsUpload';
import { Users } from './components/users';
import { UserActivity } from './components/userActivity';
import SettingsPage from './components/profilesettings';
import { GeneralSettingsPage } from './components/settingsPage';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/posts" element={<Posts />} />
        <Route path="/home" element={<Homepage />} />
        <Route path="/home/followers" element={<FollowersPage />} />
        <Route path='/share' element={<Posts />} />
        <Route path='/golive' element={<GoLiveController />} />
        <Route path='/notifications' element={<NotificationsPage/>}/>
        <Route path='/messages' element={<MessagesPage/>}/>
        <Route path='/users' element={<Users/>}/>
        <Route path='/activity' element={<UserActivity/>}/>
        <Route path='/profilesettings' element={<SettingsPage/>}/>
        <Route path='/settings' element={<GeneralSettingsPage/>}/>
        {/* <Route path='/commentsu' element={<CommentsUpload/>}></Route> */}
        <Route path='/comments' element={<Comments/>}></Route>
      </Routes>
    </>
  );
}

export default App;
