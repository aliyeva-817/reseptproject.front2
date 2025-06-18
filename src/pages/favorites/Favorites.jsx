import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFavorites, removeFavorite } from '../../services/axiosInstance';
import styles from './Favorites.module.css';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchFavorites = async () => {
      try {
        const data = await getFavorites();
        setFavorites(data.map(f => f.recipe));
      } catch (err) {
        console.error('Favoritləri yükləmək olmadı:', err);
      }
    };

    fetchFavorites();
  }, [token, navigate]);

  const handleRemove = async (recipeId) => {
    try {
      await removeFavorite(recipeId);
      setFavorites(prev => prev.filter(recipe => recipe._id !== recipeId));
    } catch (err) {
      console.error("Silinmə zamanı xəta:", err);
      alert("Silinmə mümkün olmadı");
    }
  };

  return (
    <div className={styles.container}>
      <h2>Sevdiyiniz Reseptlər</h2>
      <div className={styles.cardContainer}>
        {favorites.length === 0 ? (
          <p>Favorit resept yoxdur.</p>
        ) : (
          favorites.map((recipe) => (
            <div
              key={recipe._id}
              className={styles.card}
            >
              <img
                src={`http://localhost:5000/${recipe.image}`}
                alt={recipe.title}
                onClick={() => navigate(`/recipe/${recipe._id}`)}
              />
              <h3>{recipe.title}</h3>
              <button
                className={styles.deleteBtn}
                onClick={() => handleRemove(recipe._id)}
              >
                Sil
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Favorites;
