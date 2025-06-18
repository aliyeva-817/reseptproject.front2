import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../../services/axiosInstance';
import CommentSection from '../../components/comments/CommentSection'; // ✅ Əlavə olundu
import styles from './RecipeDetail.module.css'; // ✅ Əgər hələ yoxdursa yarada bilərsən

const RecipeDetail = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);

  useEffect(() => {
    const fetchDetail = async () => {
      const res = await axiosInstance.get(`/recipes/${id}`);
      setRecipe(res.data);
    };
    fetchDetail();
  }, [id]);

  if (!recipe) return <p>Yüklənir...</p>;

  return (
    <div className={styles.container}>
      <img className={styles.image} src={`http://localhost:5000/${recipe.image}`} alt={recipe.title} />
      <h1>{recipe.title}</h1>
      <p><strong>Ərzaqlar:</strong> {recipe.ingredients.join(', ')}</p>
      <p><strong>Resept:</strong> {recipe.instructions}</p>

      <CommentSection recipeId={id} /> {/* ✅ Əlavə olundu */}
    </div>
  );
};

export default RecipeDetail;
