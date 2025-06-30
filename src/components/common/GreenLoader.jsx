// src/components/loaders/GreenLoader.jsx
import React from 'react';
import styles from './GreenLoader.module.css';

const fruitEmojis = ['🍏', '🍎', '🍐', '🍉', '🍇', '🥝', '🥑'];

const GreenLoader = () => {
  return (
    <div className={styles.loaderWrapper}>
      <div className={styles.spinner}>
        {fruitEmojis.map((emoji, index) => (
          <span key={index} className={styles.fruit} style={{ '--i': index }}>
            {emoji}
          </span>
        ))}
      </div>
      <p className={styles.loadingText}>Yüklənir...</p>
    </div>
  );
};

export default GreenLoader;
