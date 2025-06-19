import React, { useState, useEffect } from 'react';
import axiosInstance, { getFavorites, addFavorite, removeFavorite } from '../../services/axiosInstance';
import { useNavigate } from 'react-router-dom';
import styles from './Home.module.css';
import CommentModal from '../../components/commentModal/CommentModal';
import CarouselCategory from './CarouselCategory';

const Home = () => {
  const [query, setQuery] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [comments, setComments] = useState({});
  const [newComment, setNewComment] = useState('');
  const [activeModalRecipeId, setActiveModalRecipeId] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");

  const fetchRecipes = async (ingredient = '') => {
    try {
      const res = await axiosInstance.get('/recipes', { params: { ingredient } });
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
      setFavorites(data.map(f => f.recipe?._id)); // ✅ yoxlama ilə
    } catch (err) {
      console.error('Favoritlər yüklənmədi:', err);
    }
  };

  const fetchComments = async (recipeId) => {
    try {
      const res = await axiosInstance.get(`/comments/${recipeId}`);
      setComments(prev => ({ ...prev, [recipeId]: res.data }));
    } catch (err) {
      console.error('Şərhlər yüklənmədi:', err);
    }
  };

  const toggleFavorite = async (recipeId) => {
    if (!token) return navigate('/login');
    try {
      if (favorites.includes(recipeId)) {
        await removeFavorite(recipeId);
      } else {
        await addFavorite(recipeId);
      }
      await fetchFavorites(); // ✅ real-time yenilənmə
    } catch (err) {
      console.error("Favorit əməliyyatı uğursuz oldu:", err);
    }
  };

  const handleAddComment = async (recipeId) => {
    if (!token) return navigate('/login');
    if (!newComment) return;
    try {
      await axiosInstance.post('/comments', { recipeId, content: newComment });
      setNewComment('');
      fetchComments(recipeId);
    } catch (err) {
      console.error('Şərh əlavə olunmadı:', err);
    }
  };

  const handleOpenModal = (recipeId) => {
    setActiveModalRecipeId(recipeId);
    fetchComments(recipeId);
  };

  const handleCloseModal = () => {
    setActiveModalRecipeId(null);
    setNewComment('');
  };

  useEffect(() => {
    fetchRecipes();
    fetchFavorites();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchRecipes(query);
  };

  return (
    <div className={styles.homePage}>
      {/* 🟧 Karusel ən yuxarıya çəkildi */}
      <CarouselCategory onFilter={fetchRecipesByCategory} />

      {/* 🟨 Axtarış formu */}
      <h2 className={styles.title}>🍲 Resept Axtarışı</h2>
      <form onSubmit={handleSearch} className={styles.searchForm}>
        <input
          className={styles.searchInput}
          type="text"
          placeholder="Məsələn: un, yumurta..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit" className={styles.searchButton}>🔍 Axtar</button>
      </form>

      {/* 🟩 Resept kartları */}
      <div className={styles.cardContainer}>
        {recipes.map((recipe) => (
          <div key={recipe._id} className={styles.card}>
            <div className={styles.imageWrapper}>
             <img
  src={`http://localhost:5000/${recipe.image}`} // ✅ düzgün yol
  alt={recipe.title}
  className={styles.image}
/>

            </div>

            <h3 className={styles.cardTitle}>{recipe.title}</h3>

            <div className={styles.cardActions}>
              <button
                className={styles.favBtn}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(recipe._id);
                }}
              >
                {favorites.includes(recipe._id) ? '❤️' : '🤍'}
              </button>

              <button
                className={styles.detailsBtn}
                onClick={() => navigate(`/recipe/${recipe._id}`)}
              >
                Ətraflı bax
              </button>
            </div>

            <p
              className={styles.commentToggle}
              onClick={() => handleOpenModal(recipe._id)}
            >
              💬 Comment
            </p>
          </div>
        ))}
      </div>

      {/* 🟦 Şərh modalı */}
      {activeModalRecipeId && (
        <CommentModal
          recipeId={activeModalRecipeId}
          comments={comments[activeModalRecipeId] || []}
          onClose={handleCloseModal}
          onChange={(e) => setNewComment(e.target.value)}
          newComment={newComment}
          onSubmit={() => handleAddComment(activeModalRecipeId)}
        />
      )}
    </div>
  );
};

export default Home;
