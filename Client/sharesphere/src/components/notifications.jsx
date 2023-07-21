import React, { useEffect, useState } from 'react';
import './styles/notifications.css';
import SideBar from './navbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import BackButton from './back';
import { useDarkMode } from './darkModeContext';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [darkMode] = useDarkMode()

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
    <div style={darkMode ? { backgroundColor: "black", color: "white" } : {}}>
      <SideBar />
      <div className={`mainNotifyContainer ${darkMode? `dark-mode-notification`:''}`}>
        <BackButton/>
        <h1>Notifications</h1>
        {!unreadNotifications.length && !readNotifications.length ? (
          <p>No notifications found.</p>
        ) : (
          <>
            {unreadNotifications.length > 0 && (
              <>
                <h2 className="notification-title" style={{marginLeft:"2.3em"}}>Unread</h2>
                <ul>
                  {unreadNotifications.map((notification) => (
                    <li
                      key={notification.NotificationsID}
                      className="notifications-list unread"
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
                            <div className="actions" >
                              <FontAwesomeIcon
                                className="trash-icon"
                                icon={faTrash}
                                style={{ color: '#E38B00',position: 'absolute', right: '36%', marginTop: '.2em' }}
                                onClick={() => handleDelete(notification)}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </>
            )}

            {readNotifications.length > 0 && (
              <>
                <h2 className="notification-title" style={{marginTop:"2em", marginLeft:"2.3em"}}>Read</h2>
                <ul>
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
                            <div className="actions" style={{ position: 'absolute', right: '36%', marginTop: '1.25em' }}>
                              <FontAwesomeIcon
                                className="trash-icon"
                                icon={faTrash}
                                style={{ color: '#E38B00',position: 'absolute', right: '36%', marginTop: '-1em' }}
                                onClick={() => handleDelete(notification)}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;

