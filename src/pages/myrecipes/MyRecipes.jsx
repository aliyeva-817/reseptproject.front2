import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../../services/axiosInstance';
import styles from './MyRecipes.module.css';
import CommentModal from '../../components/comments/CommentModal';
import { FaCommentDots, FaArrowRight, FaTrashAlt } from 'react-icons/fa';

const MyRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [activeCommentId, setActiveCommentId] = useState(null);

  useEffect(() => {
    const fetchMyRecipes = async () => {
      try {
        const res = await axiosInstance.get('/recipes/my');
        setRecipes(res.data);
      } catch (err) {
        console.error('Mənim reseptlərim alınmadı:', err);
      }
    };

    fetchMyRecipes();
  }, []);

  const openComments = (recipeId) => {
    setActiveCommentId(recipeId);
  };

  const closeComments = () => {
    setActiveCommentId(null);
  };

  const handleDelete = async (recipeId) => {
    if (!window.confirm("Bu resepti silmək istədiyinizə əminsiniz?")) return;
    try {
      await axiosInstance.delete(`/recipes/${recipeId}`);
      setRecipes(prev => prev.filter(r => r._id !== recipeId));
    } catch (err) {
      console.error("Silinmə xətası:", err);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Mənim Reseptlərim</h2>
      {recipes.length === 0 ? (
        <p className={styles.noRecipe}>Sizin hələ reseptiniz yoxdur.</p>
      ) : (
        <div className={styles.recipeList}>
          {recipes.map(recipe => (
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
              <div className={styles.greenLines}>
                <div className={`${styles.line} ${styles.full}`}></div>
                <div className={`${styles.line} ${styles.short}`}></div>
              </div>
              <div className={styles.actionRow}>
                <button onClick={() => openComments(recipe._id)} className={styles.commentBtn}>
                  <FaCommentDots />
                </button>
                <Link to={`/recipe/${recipe._id}`} className={styles.detailBtn}>
                  <FaArrowRight />
                </Link>
                <button onClick={() => handleDelete(recipe._id)} className={styles.deleteBtn}>
                  <FaTrashAlt />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeCommentId && (
        <CommentModal recipeId={activeCommentId} onClose={closeComments} />
      )}
    </div>
  );
};

export default MyRecipes;
