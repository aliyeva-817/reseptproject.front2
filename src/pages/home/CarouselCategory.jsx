import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './CarouselCategory.module.css';

// 🖼️ Şəkilləri import et (yolu sənin layihəndəki yerləşməyə uyğun olaraq tənzimlənib)
import dessert from '../../assets/categories/burger.png';
import main from '../../assets/categories/burger.png';
import soup from '../../assets/categories/burger.png';
import salad from '../../assets/categories/burger.png';
import breakfast from '../../assets/categories/burger.png';
import fastfood from '../../assets/categories/burger.png';
import drinks from '../../assets/categories/burger.png';

const categories = [
  { name: 'Dessert', image: dessert },
  { name: 'Main', image: main },
  { name: 'Soup', image: soup },
  { name: 'Salad', image: salad },
  { name: 'Breakfast', image: breakfast },
  { name: 'Fastfood', image: fastfood },
  { name: 'icki', image: drinks },
];

const CarouselCategory = () => {
  const navigate = useNavigate();
  const scrollRef = useRef();

  const scroll = (direction) => {
    const { current } = scrollRef;
    const scrollAmount = window.innerWidth;
    current.scrollBy({
      left: direction === 'right' ? scrollAmount : -scrollAmount,
      behavior: 'smooth',
    });
  };

  const handleCategoryClick = (category) => {
    navigate(`/category/${category}`);
  };

  return (
    <div className={styles.carouselWrapper}>
      <div ref={scrollRef} className={styles.carousel}>
        {categories.map((cat) => (
          <div key={cat.name} className={styles.item}>
            <img src={cat.image} alt={cat.name} className={styles.image} />
            <button
              onClick={() => handleCategoryClick(cat.name)}
              className={styles.button}
            >
              {cat.name}
            </button>
          </div>
        ))}
      </div>
      <div
        className={`${styles.arrow} ${styles.arrowLeft}`}
        onClick={() => scroll('left')}
      >
        ❮
      </div>
      <div
        className={`${styles.arrow} ${styles.arrowRight}`}
        onClick={() => scroll('right')}
      >
        ❯
      </div>
    </div>
  );
};

export default CarouselCategory;
