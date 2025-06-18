import React, { useState, useEffect } from 'react';
import axiosInstance, {
  getFavorites,
  addFavorite,
  removeFavorite
} from '../../services/axiosInstance';
import { useNavigate } from 'react-router-dom';
import styles from './Home.module.css';
import CommentModal from '../../components/commentModal/CommentModal';

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
      const res = await axiosInstance.get('/recipes', {
        params: { ingredient }
      });
      setRecipes(res.data);
    } catch (err) {
      console.error('Reseptləri yükləmək olmadı:', err);
    }
  };

  const fetchFavorites = async () => {
    if (!token) return;
    try {
      const data = await getFavorites();
      setFavorites(data.map(f => f.recipe._id));
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
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      if (favorites.includes(recipeId)) {
        await removeFavorite(recipeId);
      } else {
        await addFavorite(recipeId);
      }
      await fetchFavorites();
    } catch (err) {
      console.error("Favorit əməliyyatı uğursuz oldu:", err);
      alert("Əlavə və ya silmə zamanı xəta baş verdi!");
    }
  };

  const handleAddComment = async (recipeId) => {
    if (!token) {
      navigate('/login');
      return;
    }

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
    <div className={styles.container}>
      <h2>Resept Axtar</h2>
      <form onSubmit={handleSearch} className={styles.searchForm}>
        <input
          type="text"
          placeholder="Məsələn: un, yumurta..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit">Axtar</button>
      </form>

      <div className={styles.cardContainer}>
        {recipes.map((recipe) => (
          <div key={recipe._id} className={styles.card}>
           <img
  src={`http://localhost:5000/uploads/${recipe.image}`} // 🔥 uploads əlavə et
  alt={recipe.title}
/>

            <h3>{recipe.title}</h3>

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

            <p
              className={styles.commentToggle}
              onClick={() => handleOpenModal(recipe._id)}
            >
              💬 Comment
            </p>
          </div>
        ))}
      </div>

    {activeModalRecipeId && (
  <CommentModal
    recipeId={activeModalRecipeId} // BUNU ƏLAVƏ ETMİSƏN YOXDURSA MÜTLƏQ ƏLAVƏ ET
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
