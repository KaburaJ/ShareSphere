import React, { useEffect, useState } from 'react';
import './styles/notifications.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import BackButton from './back';
import { useDarkMode } from './darkModeContext';

const NotificationsPage = ({updateNotificationsCount}) => {
  const [notifications, setNotifications] = useState([]);
  const [darkMode] = useDarkMode();
  const [selectedTab, setSelectedTab] = useState('unread'); // Track which section is selected

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get('http://localhost:5003/notifications', { withCredentials: true });
        setNotifications(response.data.results);
        console.log(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchNotifications();
  }, []);

  const handleDelete = async (notification) => {
    setNotifications((prevNotifications) =>
      prevNotifications.filter((prevNotification) => prevNotification.NotificationsID !== notification.NotificationsID)
    );

    try {
      const response = await axios.delete('http://localhost:5003/user/notification', {
        data: {
          notificationID: notification.NotificationsID,
        },
        withCredentials: true,
      });

      console.log(response.data);
      console.log('Notification deleted successfully!');
    } catch (error) {
      console.error('Error while deleting notification:', error);
    }
  };

  const markNotificationRead = async (notification) => {
    const data = {
      notificationID: notification.NotificationsID,
    };

    try {
      const response = await axios.post('http://localhost:5003/user/marknotification', data, {
        withCredentials: true,
      });

      console.log(response.data[0].Result);
      updateNotificationsCount();

      setNotifications((prevNotifications) =>
        prevNotifications.map((prevNotification) =>
          prevNotification.NotificationsID === notification.NotificationsID
            ? { ...prevNotification, isRead: !prevNotification.isRead }
            : prevNotification
        )
      );
    } catch (error) {
      console.error('Error while marking notifications read:', error);
    }
  };

  const readNotifications = notifications.filter((notification) => notification.isRead);
  const unreadNotifications = notifications.filter((notification) => !notification.isRead);

  return (
    <div className="notify" style={darkMode ? { backgroundColor: "black", color: "white" } : { backgroundColor: "#F4E4EC", color:"black" }}>
      <div className={`mainNotifyContainer ${darkMode ? 'dark-mode-notification' : ''}`}>
        <BackButton />
        <header>
          <h1>Notifications</h1>
        </header>
        <div className="tabs">
          <span
            className={`tab ${selectedTab === 'unread' ? 'active' : ''}`}
            onClick={() => setSelectedTab('unread')}
          >
            Unread
          </span>
          <span
            className={`tab ${selectedTab === 'read' ? 'active' : ''}`}
            onClick={() => setSelectedTab('read')}
          >
            Read
          </span>
        </div>

        {!unreadNotifications.length && !readNotifications.length ? (
          <p>No notifications found.</p>
        ) : (
          <>
            {selectedTab === 'unread' && unreadNotifications.length > 0 && (
              <div>
                <ul className="notifications-list">
                  {unreadNotifications.map((notification) => (
                    <li
                      key={notification.NotificationsID}
                      className="notifications-list unread"
                    >
                      <div className="info">
                        <div className="content" style={{ display: 'flex', flexDirection: 'column' }}>
                          <h3 className="time" style={{ marginLeft: '-12%' }}>
                            {(notification.TimeNotified).slice(0, 10)}
                            <label style={{ marginLeft: '12em', cursor:"pointer" }}>
                              <input
                                type="checkbox"
                                checked={notification.isRead}
                                onChange={() => markNotificationRead(notification)}
                                style={{ marginRight: '1em', display: 'none' }}
                              />
                              {notification.isRead ? 'Mark as unread' : 'Mark as read'}
                            </label>
                          </h3>
                          <div className="notification-content" style={{ display: 'flex', gap: '20px' }}>
                            <p>{notification.NotificationType}</p>
                            <div className="actions" style={{ marginLeft:"23%", marginTop: '-.2em' }}>
                              <FontAwesomeIcon
                                className="trash-icon"
                                icon={faTrash}
                                style={{ color: '#E83D95', transform: 'translateY(-50%)', cursor: "pointer" }}
                                onClick={() => handleDelete(notification)}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {selectedTab === 'read' && readNotifications.length > 0 && (
              <div>
                <ul className="notifications-list">
                  {readNotifications.map((notification) => (
                    <li
                      key={notification.NotificationsID}
                      className="notifications-list read"
                    >
                      <div className="info">
                        <div className="content" style={{ display: 'flex', flexDirection: 'column' }}>
                          <h3 className="time" style={{ marginLeft: '-12%' }}>
                            {(notification.TimeNotified).slice(0, 10)}
                            <label style={{ marginLeft: '12em' }}>
                              <input
                                type="checkbox"
                                checked={notification.isRead}
                                onChange={() => markNotificationRead(notification)}
                                style={{ marginRight: '1em', display: 'none' }}
                              />
                              {notification.isRead ? 'Mark as unread' : 'Mark as read'}
                            </label>
                          </h3>
                          <div className="notification-content" style={{ display: 'flex', gap: '20px' }}>
                            <p>{notification.NotificationType}</p>
                            <div className="actions" style={{ paddingLeft:"13%", marginTop: '-.2em' }}>
                              <FontAwesomeIcon
                                className="trash-icon"
                                icon={faTrash}
                                style={{ color: '#E83D95', cursor: "pointer" }}
                                onClick={() => handleDelete(notification)}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
