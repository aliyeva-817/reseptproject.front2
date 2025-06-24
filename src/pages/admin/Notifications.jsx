import React, { useEffect, useState } from 'react';
import styles from './Notifications.module.css';
import axiosInstance from '../../services/axiosInstance';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Burada backend-də bildirişlər üçün ayrıca bir API varsa onu istifadə et
    // Test üçün sadə mock data ilə göstəririk
    const mockData = [
      { _id: '1', text: 'Yeni istifadəçi qeydiyyatdan keçdi.', date: '2025-06-24' },
      { _id: '2', text: 'Yeni ödəniş alındı.', date: '2025-06-24' },
    ];
    setNotifications(mockData);
  }, []);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Bildirişlər</h2>
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
