// src/components/theme/DarkModeToggle.jsx

import React, { useEffect, useState } from 'react';
import { FaSun, FaMoon } from 'react-icons/fa';
import styles from './DarkModeToggle.module.css';

const DarkModeToggle = () => {
  const [isDark, setIsDark] = useState(() =>
    localStorage.getItem('theme') === 'dark'
  );

  useEffect(() => {
    document.body.classList.toggle('dark', isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  return (
    <button onClick={toggleTheme} className={styles.toggleBtn}>
      {isDark ? <FaSun /> : <FaMoon />}
    </button>
  );
};

export default DarkModeToggle;
