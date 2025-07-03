import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../../services/axiosInstance';
import styles from './RecipeDetail.module.css';
import CommentModal from '../../components/comments/CommentModal';
import { FaCommentDots } from 'react-icons/fa';
import GreenLoader from '../../components/common/GreenLoader'; 

const RecipeDetail = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [activeCommentId, setActiveCommentId] = useState(null);
  const [loading, setLoading] = useState(true); 
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await axiosInstance.get(`/recipes/${id}`);
        setRecipe(res.data);
      } catch (err) {
        console.error('Resept tapılmadı:', err);
      } finally {
        setLoading(false); // ✅ Loader bağlanır
      }
    };
    fetchDetail();
  }, [id]);

  const handlePremiumAccess = async () => {
    try {
      const res = await axiosInstance.post('/stripe/checkout', {
        recipeId: recipe._id,
        title: recipe.title,
        image: `http://localhost:5000/${recipe.image}`
      });
      window.location.href = res.data.url;
    } catch (err) {
      console.error('Ödəniş xətası:', err);
      alert('Ödəniş prosesi uğursuz oldu.');
    }
  };

  const openComments = () => {
    setActiveCommentId(id);
  };

  const closeComments = () => {
    setActiveCommentId(null);
  };

  if (loading) return <GreenLoader />; // ✅ Loader görünür

  return (
    <div className={styles.container}>
      <img
        className={styles.image}
        src={
          recipe.image?.includes('uploads/')
            ? `http://localhost:5000/${recipe.image}`
            : `http://localhost:5000/uploads/${recipe.image}`
        }
        alt={recipe.title}
      />

  <h1 className={styles.title}>
  {recipe.title}
  {(recipe.addedByAdmin === true || recipe.user?.isAdmin) && (
    <span className={styles.adminBadge}>Admin tərəfindən əlavə olunub</span>
  )}
</h1>



      <p><strong className={styles.basliqq}>Ərzaqlar:</strong> {recipe.ingredients.join(', ')}</p>
      <p><strong className={styles.basliqq}>Kateqoriya:</strong> {recipe.category}</p>

      <p><strong className={styles.basliqq}>Hazırlanma:</strong></p>
      {recipe.instructions && recipe.instructions.length > 0 ? (
        <ol className={styles.instructionsList}>
          {recipe.instructions.map((step, idx) => (
            <li key={idx}>{step.trim()}</li>
          ))}
        </ol>
      ) : (
        <p><i>Hazırlanma qaydası əlavə olunmayıb.</i></p>
      )}

      {recipe.isPremium && (
        <button className={styles.premiumButton} onClick={handlePremiumAccess}>
          Premium reseptə keç
        </button>
      )}

     

      {activeCommentId && (
        <CommentModal recipeId={activeCommentId} onClose={closeComments} />
      )}
    </div>
  );
};

export default RecipeDetail;
