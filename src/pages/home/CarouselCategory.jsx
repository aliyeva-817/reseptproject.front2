import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './CarouselCategory.module.css';

const categories = [
  { name: 'Dessert', image: '/images/dessert.png' },
  { name: 'Main', image: '/images/main.png' },
  { name: 'Soup', image: '/images/soup.png' },
  { name: 'Salad', image: '/images/salad.png' },
  { name: 'Breakfast', image: '/images/breakfast.png' },
  { name: 'Fastfood', image: '/images/fastfood.png' },
  { name: 'icki', image: '/images/drinks.png' },
];

const CarouselCategory = () => {
  const navigate = useNavigate();

  const handleCategoryClick = (category) => {
    navigate(`/category/${category}`);
  };

  return (
    <div className={styles.carousel}>
      {categories.map(cat => (
        <div key={cat.name} className={styles.item}>
          <img src={cat.image} alt={cat.name} className={styles.image} />
          <button onClick={() => handleCategoryClick(cat.name)} className={styles.button}>
            {cat.name}
          </button>
        </div>
      ))}
    </div>
  );
};

export default CarouselCategory;
