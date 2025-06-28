import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../../services/axiosInstance';
import styles from './Premium.module.css';

const Premium = () => {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    const fetchPremiumRecipes = async () => {
      try {
        const res = await axiosInstance.get('/recipes/premium');
        setRecipes(res.data);
      } catch (err) {
        console.error('Premium reseptləri yüklənmədi:', err);
      }
    };
    fetchPremiumRecipes();
  }, []);

  return (
    <div className={styles.container}>
      <h2>💎 Premium Reseptlər</h2>
      {recipes.length === 0 ? (
        <p className={styles.noRecipes}>Hazırda premium resept yoxdur.</p>

      ) : (
        <div className={styles.grid}>
          {recipes.map((recipe) => (
            <div key={recipe._id} className={styles.card}>
              <img
                src={
                  recipe.image?.includes('uploads/')
                    ? `http://localhost:5000/${recipe.image}`
                    : `http://localhost:5000/uploads/${recipe.image}`
                }
                alt={recipe.title}
                className={styles.image}
              />
              <h3 className={styles.title}>{recipe.title}</h3>
               <div className={styles.greenLines}>
    <div className={`${styles.line} ${styles.full}`}></div>
    <div className={`${styles.line} ${styles.short}`}></div>
  </div>
              <Link to={`/premium/${recipe._id}`} className={styles.button}>
                Ətraflı bax
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Premium;
