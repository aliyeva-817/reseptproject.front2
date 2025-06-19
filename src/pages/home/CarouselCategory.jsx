import React, { useRef } from 'react';
import styles from './CarouselCategory.module.css';

import salad from '../../assets/categories/salad.png';
import main from '../../assets/categories/burger.png';

const categories = [
  { name: 'Salad', label: '🥗 Salatlar', image: salad },
  { name: 'Main', label: '🍛 Əsas Yeməklər', image: main },
];

const CarouselCategory = ({ onFilter }) => {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    const container = scrollRef.current;
    if (container) {
      const scrollAmount = direction === 'left' ? -container.offsetWidth : container.offsetWidth;
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      <button className={`${styles.navButton} ${styles.left}`} onClick={() => scroll('left')}>←</button>
      <div className={styles.carousel} ref={scrollRef}>
        {categories.map((cat) => (
          <div key={cat.name} className={styles.item}>
            <img src={cat.image} alt={cat.label} className={styles.image} />
            <button onClick={() => onFilter(cat.name)} className={styles.button}>
              {cat.label}
            </button>
          </div>
        ))}
      </div>
      <button className={`${styles.navButton} ${styles.right}`} onClick={() => scroll('right')}>→</button>
    </div>
  );
};

export default CarouselCategory;
