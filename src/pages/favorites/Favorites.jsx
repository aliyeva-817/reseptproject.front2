// ✅ Favorites.jsx (tam uyğunlaşdırılmış versiya)
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFavorites, removeFavorite } from '../../services/axiosInstance';
import styles from './Favorites.module.css';
import CommentModal from '../../components/comments/CommentModal';
import GreenLoader from '../../components/common/GreenLoader';
import { FaCommentDots } from 'react-icons/fa';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [activeCommentId, setActiveCommentId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
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
      } finally {
        setIsLoading(false);
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

  const handleDetail = (recipe) => {
    if (recipe.isPremium) {
      navigate(`/premium/${recipe._id}`);
    } else {
      navigate(`/recipe/${recipe._id}`);
    }
  };

  const openComments = (recipeId) => setActiveCommentId(recipeId);
  const closeComments = () => setActiveCommentId(null);

  if (isLoading) return <GreenLoader />;

  return (
    <div className={styles.container}>
      <h2>Sevdiyiniz Reseptlər</h2>
      <div className={styles.cardContainer}>
        {favorites.length === 0 ? (
          <p>Favorit resept yoxdur.</p>
        ) : (
          favorites.map((recipe) => (
            <div key={recipe._id} className={styles.card}>
              {recipe.isPremium && <div className={styles.premiumLabel}>★ Premium</div>}
              <div className={styles.imageWrapper}>
                <img
                  src={recipe.image?.includes('uploads/')
                    ? `http://localhost:5000/${recipe.image}`
                    : `http://localhost:5000/uploads/${recipe.image}`}
                  alt={recipe.title}
                  className={styles.image}
                />
                <div className={styles.iconOverlay}>
                  <button onClick={() => handleRemove(recipe._id)}>
                    <span
                      dangerouslySetInnerHTML={{
                        __html: `
                         <lord-icon
  src="https://cdn.lordicon.com/drxwpfop.json"
  trigger="hover"
  colors="primary:#fff,secondary:#ffdd57"
  style="width:26px;height:26px">
</lord-icon>

                        `,
                      }}
                    />
                  </button>
                  <button onClick={() => openComments(recipe._id)}>
                    <FaCommentDots />
                  </button>
                </div>
              </div>
              <h3>{recipe.title}</h3>
              <button
                onClick={() => handleDetail(recipe)}
                className={styles.detailBtnFull}
              >
                Ətraflı bax
              </button>
            </div>
          ))
        )}
      </div>
      {activeCommentId && <CommentModal recipeId={activeCommentId} onClose={closeComments} />}
    </div>
  );
};

export default Favorites;
