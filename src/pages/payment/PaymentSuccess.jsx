import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import axiosInstance from '../../services/axiosInstance';
import styles from './PaymentSuccess.module.css';
import GreenLoader from '../../components/common/GreenLoader'; // ✅ Loader import

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

  if (!recipe) return <GreenLoader />; // ✅ Yüklənmədə loader göstər

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>✅ Ödəniş uğurla tamamlandı!</h2>
      <p className={styles.subtitle}>Premium reseptə baxa bilərsiniz.</p>

      <div className={styles.recipe}>
        <img
          src={`http://localhost:5000/${recipe.image}`}
          alt={recipe.title}
          className={styles.image}
        />
        <h3 className={styles.title}>{recipe.title}</h3>
        <p className={styles.text}><strong>Kateqoriya:</strong> {recipe.category}</p>
        <p className={styles.text}><strong>Ərzaqlar:</strong> {recipe.ingredients.join(', ')}</p>
        <p className={styles.text}><strong>Hazırlanma:</strong> {recipe.instructions.join(' → ')}</p>
        <ul className={styles.instructions}>
          {recipe.instructions.map((step, idx) => (
            <li key={idx}>{step}</li>
          ))}
        </ul>
      </div>

      <Link to="/premium" className={styles.button}>
        Premium səhifəsinə qayıt
      </Link>
    </div>
  );
};

export default PaymentSuccess;
