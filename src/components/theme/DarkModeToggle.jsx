import React, { useEffect, useState } from 'react';
import { CiSun } from "react-icons/ci";
import { IoMoonOutline } from "react-icons/io5";
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
      {isDark ? (
        <CiSun style={{ fontSize: '32px' }} />
      ) : (
        <IoMoonOutline style={{ fontSize: '27px' }} />
      )}
    </button>
  );
};

export default DarkModeToggle;
