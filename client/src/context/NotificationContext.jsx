import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [activeCategory, setActiveCategory] = useState('All');
  const [language, setLanguage] = useState('ta'); // 'ta' for Tamil, 'en' for English

  const fetchNotifications = async () => {
    try {
      const res = await axios.get(`/api/public/notifications?category=${activeCategory}`);
      if (res.data.success) {
        setNotifications(res.data.notifications);
        setUnreadCount(res.data.notifications.length);
      }
    } catch (err) {
      console.warn('Failed to fetch notifications:', err.message);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 20000);
    return () => clearInterval(interval);
  }, [activeCategory]);

  const markAllRead = () => setUnreadCount(0);

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'ta' ? 'en' : 'ta'));
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        activeCategory,
        setActiveCategory,
        fetchNotifications,
        markAllRead,
        language,
        setLanguage,
        toggleLanguage
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);
