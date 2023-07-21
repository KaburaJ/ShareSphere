import React from 'react';
import './styles/messages.css';
import SideBar from '../components/navbar.jsx';
import avatar1 from '../images/wallp1.jpg';
import avartar2 from '../images/walllp.jpg'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import BackButton from './back';
import { useDarkMode } from './darkModeContext';

const MessagesPage = () => {
  const [darkMode] = useDarkMode()
  // Dummy data for messages
  const messages = [
    {
      id: 1,
      sender: {
        id: 1,
        name: 'Wa Maiko',
        avatar: avatar1,
      },
      message: 'Hey, how are you?',
      timestamp: '2 hours ago',
    },
    {
      id: 2,
      sender: {
        id: 2,
        name: 'Jonte',
        avatar: avartar2,
      },
      message: 'Are we still meeting tomorrow?',
      timestamp: '1 day ago',
    },
    // Add more messages here
  ];

  return (
    <div style={darkMode ? { backgroundColor: "black", color: "white" } : {}}>
    <SideBar/>
    <div className={`mainMessagesContainer ${darkMode ? 'dark-mode-messages' : ''}`}>
        <BackButton/>
        <h1>Messages</h1>
        {messages.length === 0 ? (
          <p>No messages found.</p>
        ) : (
          <ul className="messageList">
            {messages.map((message) => (
              <li key={message.id} className="messageItem">
                <div className="avatarContainer">
                  <img src={message.sender.avatar} alt="Avatar" className="avatar" />
                </div>
                <div className="messageContent">
                  <div className="messageHeader">
                    <h3 className="senderName">{message.sender.name}</h3>
                    <p className="timestamp">{message.timestamp}</p>
                  </div>
                  <p className="messageText">{message.message}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default MessagesPage;
