import React, { useState, useEffect } from 'react';
import axiosInstance, { getFavorites, addFavorite, removeFavorite } from '../../services/axiosInstance';
import { useNavigate } from 'react-router-dom';
import styles from './Home.module.css';
import CarouselCategory from './CarouselCategory';
import CommentModal from '../../components/comments/CommentModal';
import { FaHeart, FaRegHeart, FaCommentDots } from 'react-icons/fa';

import food1 from '../../assets/food/food1.png';
import food2 from '../../assets/food/food2.png';
import food3 from '../../assets/food/food3.png';
import food4 from '../../assets/food/food4.png';

const Home = () => {
  const [query, setQuery] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [showIntro, setShowIntro] = useState(false);
  const [activeCommentId, setActiveCommentId] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");

  const fetchRecipes = async () => {
    try {
      const res = await axiosInstance.get('/recipes');
      setRecipes(res.data);
    } catch (err) {
      console.error('Reseptləri yükləmək olmadı:', err);
    }
  };

  const fetchRecipesByCategory = async (category) => {
    try {
      const res = await axiosInstance.get(`/recipes/category/search?category=${category}`);
      setRecipes(res.data);
    } catch (err) {
      console.error('Kategoriya üzrə filter alınmadı:', err);
    }
  };

  const fetchFavorites = async () => {
    if (!token) return;
    try {
      const data = await getFavorites();
      setFavorites(data.map(f => f.recipe?._id));
    } catch (err) {
      console.error("Favoritləri yükləmək mümkün olmadı:", err);
    }
  };

  const handleSearch = async () => {
    if (!query.trim()) return;
    try {
      const res = await axiosInstance.get(`/recipes/search?ingredient=${encodeURIComponent(query)}`);
      if (res.data.length === 0 || res.data.message === 'Uyğun resept tapılmadı.') {
        alert('Uyğun resept tapılmadı.');
        setRecipes([]);
      } else {
        setRecipes(res.data);
      }
    } catch (err) {
      console.error("Axtarış alınmadı:", err);
      alert("Axtarış zamanı xəta baş verdi.");
    }
  };

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
      console.error('Favorit dəyişmə xətası:', err);
    }
  };

  const handleIntroEnd = () => {
    setShowIntro(false);
    localStorage.setItem('introWatched', 'true');
    document.body.style.overflow = 'auto';
  };

  useEffect(() => {
    const hasWatched = localStorage.getItem('introWatched');
    if (!hasWatched) {
      setShowIntro(true);
      document.body.style.overflow = 'hidden';
    }
  }, []);

  useEffect(() => {
    if (!showIntro) {
      fetchRecipes();
      fetchFavorites();
    }
  }, [showIntro]);

  const openComments = (recipeId) => {
    setActiveCommentId(recipeId);
  };

  const closeComments = () => {
    setActiveCommentId(null);
  };

  const handleRecipeClick = (recipe) => {
    if (recipe.isPremium) {
      navigate(`/premium/${recipe._id}`);
    } else {
      navigate(`/recipe/${recipe._id}`);
    }
  };

  if (showIntro) {
    return (
      <div style={{ position: 'fixed', inset: 0, zIndex: 9999 }}>
        <video
          autoPlay
          muted
          playsInline
          onEnded={handleIntroEnd}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        >
          <source src="/videos/intro.mp4" type="video/mp4" />
          Brauzeriniz bu videonu dəstəkləmir.
        </video>
        <button
          onClick={handleIntroEnd}
          style={{
            position: 'absolute',
            bottom: 50,
            left: '50%',
            transform: 'translateX(-50%)',
            padding: '12px 24px',
            fontSize: '1rem',
            background: '#ff4d4f',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            zIndex: 10000
          }}
        >
          Əsas səhifəyə keç →
        </button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <CarouselCategory onSelectCategory={fetchRecipesByCategory} />

      <div className={styles.heroContainer}>
        <img src={food1} className={`${styles.foodImage} ${styles.img1}`} alt="food1" />
        <img src={food2} className={`${styles.foodImage} ${styles.img2}`} alt="food2" />
        <img src={food3} className={`${styles.foodImage} ${styles.img3}`} alt="food3" />
        <img src={food4} className={`${styles.foodImage} ${styles.img4}`} alt="food4" />

        <div className={styles.searchSection}>
          <h1 className={styles.heroTitle}>Yemək tapmaq indi daha asandır!</h1>
          <div className={styles.searchGroup}>
            <input
              type="text"
              placeholder="Ərzağa görə axtar..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className={styles.searchInput}
            />
            <button onClick={handleSearch} className={styles.searchBtn}>🔍</button>
          </div>
        </div>
      </div>

      <div className={styles.recipeList}>
        {recipes.map((recipe) => (
          <div key={recipe._id} className={styles.card}>
            {recipe.isPremium && <div className={styles.premiumLabel}>★ Premium</div>}
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
            <div className={styles.actionRow}>
              <button onClick={() => handleFavoriteToggle(recipe._id)} className={styles.favoriteBtn}>
                {favorites.includes(recipe._id) ? <FaHeart /> : <FaRegHeart />}
              </button>
              <button onClick={() => openComments(recipe._id)} className={styles.commentBtn}>
                <FaCommentDots />
              </button>
            </div>
            <button onClick={() => handleRecipeClick(recipe)} className={styles.detailBtn}>
              Ətraflı bax
            </button>
          </div>
        ))}
      </div>

      {activeCommentId && (
        <CommentModal recipeId={activeCommentId} onClose={closeComments} />
      )}
    </div>
  );
};

export default Home;
