import React, { useEffect, useState } from 'react';
import axiosInstance from '../../services/axiosInstance';
import { useNavigate } from 'react-router-dom';
import styles from './Premium.module.css'; // CSS modul faylı varsa istifadə olunur

const Premium = () => {
  const [recipes, setRecipes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPremiumRecipes = async () => {
      try {
        const res = await axiosInstance.get('/recipes/premium');
        setRecipes(res.data);
      } catch (err) {
        console.error('Premium reseptləri yükləmək alınmadı:', err);
      }
    };

    fetchPremiumRecipes();
  }, []);

  return (
    <div className={styles.container}>
      <h2>Premium Reseptlər</h2>
      <div className={styles.recipeList}>
        {recipes.map(recipe => (
          <div key={recipe._id} className={styles.card}>
            <img
              src={`http://localhost:5000/${recipe.image}`}
              alt={recipe.title}
              className={styles.image}
            />
            <h3>{recipe.title}</h3>
            <button
              className={styles.detailBtn}
              onClick={() => navigate(`/recipe/${recipe._id}`)}
            >
              Ətraflı bax
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Premium;
