import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './RecipeCard.module.css'; // Əgər yoxdursa yarada bilərik

const RecipeCard = ({ recipe }) => {
  const navigate = useNavigate();

  return (
    <div onClick={() => navigate(`/recipes/${recipe._id}`)} className={styles.card}>
      <img
        src={`http://localhost:5000/${recipe.image}`}
        alt={recipe.title}
        className={styles.image}
      />
      <h3 className={styles.title}>{recipe.title}</h3>

      {/* 👇 Kim tərəfindən əlavə olunub - admin və ya istifadəçi */}
      <p className={styles.label}>
        {recipe.user?.isAdmin ? '🛡️ Admin Resepti' : '👤 İstifadəçi Resepti'}
      </p>
    </div>
  );
};

export default RecipeCard;
