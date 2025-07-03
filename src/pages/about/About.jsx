
import React from 'react';
import styles from './About.module.css';

const About = () => {
  return (
    <div className={styles.aboutPage}>
      <div className={styles.aboutContent}>
        <h1>Haqqımızda</h1>
        <p>
          Reseptmatik yemək sevərlər üçün yaradılmış unikal platformadır. Burada hər kəs öz mətbəx
          bacarığını paylaşa, başqalarından ilham ala və yeni reseptlər kəşf edə bilər.
        </p>
        <p>
          Layihəmiz 2025-ci ildə yeməklərə olan sevginin rəqəmsal məkana daşınması ilə
          başlamışdır. Məqsədimiz yemək mədəniyyətini qorumaq və yaymaqla yanaşı, istifadəçilər
          arasında birgə öyrənmə və paylaşma mühitini inkişaf etdirməkdir.
        </p>
        <p>
          Biz keyfiyyətli, orijinal və səmimi məzmunun tərəfdarıyıq. Platformamız sadə istifadəyə və
          vizual zövqə əsaslanır.
        </p>
        <p>
          Siz də reseptlərinizi paylaşaraq bu böyük mətbəx ailəsinin bir hissəsinə çevrilin!
        </p>
      </div>
    </div>
  );
};

export default About;
