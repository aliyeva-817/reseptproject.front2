import React, { useState, useEffect } from 'react';
import axiosInstance, { getFavorites, addFavorite, removeFavorite } from '../../services/axiosInstance';
import { useNavigate } from 'react-router-dom';
import styles from './Home.module.css';
import CarouselCategory from './CarouselCategory';
import CommentSection from '../../components/comments/CommentSection';

const Home = () => {
  const [query, setQuery] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [favorites, setFavorites] = useState([]);
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

  useEffect(() => {
    fetchRecipes();
    fetchFavorites();
  }, []);

  return (
    <div className={styles.container}>
      <CarouselCategory onSelectCategory={fetchRecipesByCategory} />

      <div className={styles.searchContainer}>
        <input
          type="text"
          placeholder="Ərzağa görə axtar..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className={styles.searchInput}
        />
        <button onClick={handleSearch} className={styles.searchIcon}>🔍</button>
      </div>

      <div className={styles.recipeList}>
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
            <button onClick={() => handleFavoriteToggle(recipe._id)} className={styles.favoriteBtn}>
              {favorites.includes(recipe._id) ? '❤️' : '🤍'}
            </button>
            <button onClick={() => navigate(`/recipe/${recipe._id}`)} className={styles.detailBtn}>
              Ətraflı bax
            </button>
            <CommentSection recipeId={recipe._id} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
