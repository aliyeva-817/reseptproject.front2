import React, { useState, useEffect } from 'react';
import axiosInstance, { getFavorites, addFavorite, removeFavorite } from '../../services/axiosInstance';
import { useNavigate } from 'react-router-dom';
import styles from './Home.module.css';
import { FaHeart, FaRegHeart, FaCommentDots } from 'react-icons/fa';
import { toast } from 'react-toastify';
import GreenLoader from '../../components/common/GreenLoader';

import food1 from '../../assets/food/food1.png';
import food2 from '../../assets/food/food2.png';
import food3 from '../../assets/food/food3.png';
import food4 from '../../assets/food/food4.png';

const Home = () => {
  const [query, setQuery] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [showIntro, setShowIntro] = useState(false);
  const [noResultsMessage, setNoResultsMessage] = useState(false);
  const [showRecipes, setShowRecipes] = useState(true);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");

  const fetchRecipes = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get('/recipes');
      setRecipes(res.data);
    } catch (err) {
      toast.error('❌ Reseptləri yükləmək mümkün olmadı');
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

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const res = await axiosInstance.get(`/recipes/search?ingredient=${encodeURIComponent(query)}`);
      const data = res.data;

      if (!Array.isArray(data) || data.length === 0) {
        toast.info('ℹ️ Uyğun resept tapılmadı.');
        setQuery('');
        setNoResultsMessage(true);
        setShowRecipes(false);
        setTimeout(() => {
          setNoResultsMessage(false);
          setShowRecipes(true);
          fetchRecipes();
        }, 3000);
      } else {
        setRecipes(data);
        setNoResultsMessage(false);
        setShowRecipes(true);
      }
    } catch (err) {
      toast.info("ℹ️ Uyğun resept tapılmadı.");
      setQuery('');
      setNoResultsMessage(true);
      setShowRecipes(false);
      setTimeout(() => {
        setNoResultsMessage(false);
        setShowRecipes(true);
        fetchRecipes();
      }, 3000);
    } finally {
      setLoading(false);
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
      toast.error("❌ Favorit dəyişdirilə bilmədi");
    }
  };

  const handleIntroEnd = () => {
    setShowIntro(false);
    sessionStorage.setItem('introWatched', 'true');
    document.body.style.overflow = 'auto';
  };

  useEffect(() => {
    const hasWatched = sessionStorage.getItem('introWatched');
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

  const handleRecipeClick = (recipe) => {
    navigate(recipe.isPremium ? `/premium/${recipe._id}` : `/recipe/${recipe._id}`);
  };

  const goToCommentsPage = (id) => {
    navigate(`/comments/${id}`);
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
  bottom: 20,              
  left: '50%',
  transform: 'translateX(-50%)',
  padding: '14px 16px',    
  fontSize: '1rem',
  background: '#ff4d4f',    
  color: 'white',          
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  maxWidth: '400px',       
  width: 'auto',
  zIndex: 10000,
  textAlign: 'center',
  }}
        >
          Əsas səhifəyə keç →
        </button>
      </div>
    );
  }

  if (loading) return <GreenLoader />;

  return (
    <div className={styles.container}>
      <div className={styles.heroContainer}>
        <img src={food1} className={`${styles.foodImage} ${styles.img1}`} alt="food1" />
        <img src={food2} className={`${styles.foodImage} ${styles.img2}`} alt="food2" />
        <img src={food3} className={`${styles.foodImage} ${styles.img3}`} alt="food3" />
        <img src={food4} className={`${styles.foodImage} ${styles.img4}`} alt="food4" />

        <div className={styles.searchSection}>
          <h1 className={styles.heroTitle}>Ərzağa görə yemək tapmaq indi daha asandır!</h1>
          <div className={styles.searchGroup}>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className={styles.searchInput}
              placeholder="Axtar..."
            />
            <button onClick={handleSearch} className={styles.searchBtn}>
              <span
                dangerouslySetInnerHTML={{
                  __html: `
                    <lord-icon
                      src="https://cdn.lordicon.com/hoetzosy.json"
                      trigger="hover"
                      colors="primary:#5a7b5b"
                      style="width:24px;height:24px">
                    </lord-icon>
                  `,
                }}
              />
            </button>
          </div>
        </div>
      </div>

      {noResultsMessage && (
        <div className={styles.noResultsMessage}>Uyğun resept tapılmadı.</div>
      )}

      {showRecipes && (
        <div className={styles.recipeList}>
          {recipes.map((recipe) => (
            <div key={recipe._id} className={styles.card}>
              {recipe.isPremium && <div className={styles.premiumLabel}>★ Premium</div>}
              <div className={styles.imageWrapper}>
                <img
                  src={recipe.image?.includes('uploads/')
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
              <div className={styles.ingredientCarousel}>
                {recipe.ingredients?.map((ing, index) => (
                  <span key={index} className={styles.ingredientTag}>{ing}</span>
                ))}
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

export default Home;
