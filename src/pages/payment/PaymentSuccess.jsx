import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import axiosInstance from '../../services/axiosInstance';
import styles from './PaymentSuccess.module.css';
import GreenLoader from '../../components/common/GreenLoader'; 

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

  if (!recipe) return <GreenLoader />;

  return (
    <>
      <div className={styles.successMessage}>
        <h2>✅ Ödəniş uğurla tamamlandı!</h2>
        <p>Premium reseptə baxa bilərsiniz.</p>
      </div>

      <div className={styles.container}>
        <div className={styles.recipe}>
          <img
            src={`http://localhost:5000/${recipe.image}`}
            alt={recipe.title}
            className={styles.image}
          />
          <h3 className={styles.title}>{recipe.title}</h3>
          <p className={styles.text}><strong>Kateqoriya:</strong> {recipe.category}</p>
          <p className={styles.text}><strong>Ərzaqlar:</strong> {recipe.ingredients.join(', ')}</p>

          <h4 className={styles.basliqq}>Hazırlanma qaydası:</h4>
          <ol className={styles.instructions}>
            {recipe.instructions.map((step, idx) => (
              <li key={idx}>{step}</li>
            ))}
          </ol>
        </div>

        <Link to="/premium" className={styles.button}>
          Premium səhifəsinə qayıt
        </Link>
      </div>
    </>
  );
};

export default PaymentSuccess;
