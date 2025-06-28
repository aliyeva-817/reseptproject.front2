import React, { useEffect, useState } from 'react';
import axios from '../../services/axiosInstance';
import styles from './PremiumRecipes.module.css';
import { useNavigate } from 'react-router-dom';

const PremiumRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPremiumRecipes = async () => {
      try {
        const res = await axios.get('/recipes'); // Bütün reseptləri al
        const premiumOnly = res.data.filter(recipe => recipe.isPremium); // Yalnız premium
        setRecipes(premiumOnly);
      } catch (err) {
        console.error('Premium reseptlər alınmadı:', err);
      }
    };
    fetchPremiumRecipes();
  }, []);

  const handleViewClick = (recipe) => {
    navigate(`/premium/${recipe._id}`, { state: recipe }); // resepti göndər
  };

  return (
    <div className={styles.container}>
      <h2>🌟 Premium Reseptlər</h2>
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
            <h3>{recipe.title}</h3>
            <button onClick={() => handleViewClick(recipe)}>Bax</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PremiumRecipes;
