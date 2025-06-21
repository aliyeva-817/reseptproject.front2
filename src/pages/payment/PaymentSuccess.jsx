import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import axiosInstance from '../../services/axiosInstance';
import styles from './Payment.module.css';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const recipeId = searchParams.get('recipeId');
  const [recipe, setRecipe] = useState(null);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const res = await axiosInstance.get(`/recipes/${recipeId}`);
        setRecipe(res.data);
      } catch (err) {
        console.error('Resept yüklənmədi:', err);
      }
    };
    if (recipeId) fetchRecipe();
  }, [recipeId]);

  return (
    <div className={styles.container}>
      <h2>✅ Ödəniş uğurla tamamlandı!</h2>
      <p>Premium reseptə baxa bilərsiniz.</p>

      {recipe && (
        <div className={styles.recipe}>
          <img src={`http://localhost:5000/${recipe.image}`} alt={recipe.title} className={styles.image} />
          <h3>{recipe.title}</h3>
          <p><strong>Kateqoriya:</strong> {recipe.category}</p>
          <p><strong>Ərzaqlar:</strong> {recipe.ingredients.join(', ')}</p>
          <p><strong>Hazırlanma:</strong> {recipe.instructions.join(' → ')}</p>
        </div>
      )}

      <Link to="/premium" className={styles.button}>Premium səhifəsinə qayıt</Link>
    </div>
  );
};

export default PaymentSuccess;
