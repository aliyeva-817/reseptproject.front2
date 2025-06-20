import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFavorites, removeFavorite } from '../../services/axiosInstance';
import styles from './Favorites.module.css';
import CommentSection from '../../components/comments/CommentSection';

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
        const filtered = data.filter(f => f.recipe !== null).map(f => f.recipe);
        setFavorites(filtered);
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
          favorites.map((recipe) => {
            if (!recipe) return null;
            return (
              <div key={recipe._id} className={styles.card}>
                <img src={`http://localhost:5000/${recipe.image}`} alt={recipe.title} className={styles.image} />
                <h3>{recipe.title}</h3>
                <button onClick={() => handleRemove(recipe._id)} className={styles.removeBtn}>Sil</button>
                <CommentSection recipeId={recipe._id} />
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Favorites;
