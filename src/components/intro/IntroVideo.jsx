import React from 'react';
import styles from './IntroVideo.module.css';

const IntroVideo = ({ onSkip }) => {
  return (
    <div className={styles.introContainer}>
      <video
        className={styles.video}
        autoPlay
        muted
        playsInline
        onEnded={onSkip}
      >
        <source src="/videos/intro.mp4" type="video/mp4" />
        Sizin brauzeriniz video dəstəkləmir.
      </video>
      <button className={styles.skipBtn} onClick={onSkip}>
        Menyulara keç
      </button>
    </div>
  );
};

export default IntroVideo;
