import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../../services/axiosInstance'; // ✅ Doğru axios import
import styles from './Premium.module.css';

const Premium = () => {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    const fetchPremiumRecipes = async () => {
      try {
        const res = await axiosInstance.get('/recipes/premium'); // ✅ Token daxil edilir
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
        <p>Hazırda premium resept yoxdur.</p>
      ) : (
        <div className={styles.grid}>
          {recipes.map((recipe) => (
            <div key={recipe._id} className={styles.card}>
              <img
                src={`http://localhost:5000/${recipe.image}`}
                alt={recipe.title}
                className={styles.image}
              />
              <h3>{recipe.title}</h3>
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
