import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance, { getFavorites, addFavorite, removeFavorite } from '../../services/axiosInstance';
import GreenLoader from '../../components/common/GreenLoader';
import { FaHeart, FaRegHeart, FaCommentDots } from 'react-icons/fa';
import styles from './Premium.module.css';
import { toast } from 'react-toastify';

const Premium = () => {
  const [recipes, setRecipes] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    const fetchPremiumRecipes = async () => {
      try {
        const res = await axiosInstance.get('/recipes/premium');
        setRecipes(res.data);
      } catch (err) {
        toast.error('❌ Premium reseptlər yüklənə bilmədi');
      } finally {
        setLoading(false);
      }
    };

    const fetchFavorites = async () => {
      if (!token) return;
      try {
        const data = await getFavorites();
        setFavorites(data.map(f => f.recipe?._id));
      } catch (err) {
        toast.error("❌ Favoritləri yükləmək mümkün olmadı");
      }
    };

    fetchPremiumRecipes();
    fetchFavorites();
  }, [token]);

  const handleFavoriteToggle = async (recipeId) => {
    if (!token) return navigate('/login');
    try {
      if (favorites.includes(recipeId)) {
        await removeFavorite(recipeId);
        setFavorites(prev => prev.filter(id => id !== recipeId));
      } else {
        await addFavorite(recipeId);
        setFavorites(prev => [...prev, recipeId]);
      }
    } catch (err) {
      toast.error("❌ Favorit dəyişdirilə bilmədi");
    }
  };

  const goToCommentsPage = (id) => {
    navigate(`/comments/${id}`);
  };

  const handleRecipeClick = (recipe) => {
    navigate(`/premium/${recipe._id}`);
  };

  if (loading) return <GreenLoader />;

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Premium Reseptlər</h2>
      {recipes.length === 0 ? (
        <p className={styles.noRecipe}>Hazırda premium resept yoxdur.</p>
      ) : (
        <div className={styles.recipeList}>
          {recipes.map((recipe) => (
            <div key={recipe._id} className={styles.card}>
              <div className={styles.imageWrapper}>
                <img
                  src={
                    recipe.image?.includes('uploads/')
                      ? `http://localhost:5000/${recipe.image}`
                      : `http://localhost:5000/uploads/${recipe.image}`
                  }
                  alt={recipe.title}
                  className={styles.image}
                />
                <div className={styles.iconOverlay}>
                  <button onClick={() => handleFavoriteToggle(recipe._id)}>
                    {favorites.includes(recipe._id) ? <FaHeart /> : <FaRegHeart />}
                  </button>
                  <button onClick={() => goToCommentsPage(recipe._id)}>
                    <FaCommentDots />
                  </button>
                </div>
              </div>
              <h3>{recipe.title}</h3>
              <div className={styles.greenLines}>
                <div className={`${styles.line} ${styles.full}`}></div>
                <div className={`${styles.line} ${styles.short}`}></div>
              </div>
              <button onClick={() => handleRecipeClick(recipe)} className={styles.detailBtnFull}>
                Ətraflı bax
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Premium;