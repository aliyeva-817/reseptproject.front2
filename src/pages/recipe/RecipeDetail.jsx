import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../../services/axiosInstance';
import styles from './RecipeDetail.module.css';
import CommentSection from '../../components/comments/CommentSection';

const RecipeDetail = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await axiosInstance.get(`/recipes/${id}`);
        setRecipe(res.data);
      } catch (err) {
        console.error('Resept tapılmadı:', err);
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
      window.location.href = res.data.url; // Stripe linkə yönləndir
    } catch (err) {
      console.error('Ödəniş xətası:', err);
      alert('Ödəniş prosesi uğursuz oldu.');
    }
  };

  if (!recipe) return <p>Yüklənir...</p>;

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

      <h1>{recipe.title}</h1>
      <p><strong>Ərzaqlar:</strong> {recipe.ingredients.join(', ')}</p>
      <p><strong>Kateqoriya:</strong> {recipe.category}</p>
      <p><strong>Hazırlanma:</strong></p>
      {recipe.instructions && recipe.instructions.length > 0 ? (
        <ol>
          {(Array.isArray(recipe.instructions)
            ? recipe.instructions
            : typeof recipe.instructions === 'string'
              ? recipe.instructions.split('.').filter(Boolean)
              : []
          ).map((step, idx) => (
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

      <h3>Şərhlər</h3>
      <CommentSection recipeId={id} />
    </div>
  );
};

export default RecipeDetail;
