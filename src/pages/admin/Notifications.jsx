import React, { useEffect, useState } from 'react';
import styles from './Notifications.module.css';
import axiosInstance from '../../services/axiosInstance';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
  
    const mockData = [
      { _id: '1', text: 'Yeni istifadəçi qeydiyyatdan keçdi.' },
      { _id: '2', text: 'Yeni ödəniş alındı.' },
    ];
    setNotifications(mockData);
  }, []);

  return (
    <div className={styles.container}>
     
      {notifications.length === 0 ? (
        <p className={styles.empty}>Bildiriş yoxdur.</p>
      ) : (
        <ul className={styles.list}>
          {notifications.map((n) => (
            <li key={n._id} className={styles.item}>
              <span>{n.text}</span>
              <span className={styles.date}>{n.date}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Notifications;
