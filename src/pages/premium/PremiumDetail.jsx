import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../../services/axiosInstance';
import styles from './PremiumDetail.module.css';

const PremiumDetail = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const res = await axiosInstance.get(`/recipes/${id}`);
        setRecipe(res.data);
      } catch (err) {
        console.error('Resept tapılmadı:', err);
      }
    };
    fetchRecipe();
  }, [id]);

  const handlePayment = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.post('/stripe/create-checkout-session', {
        recipeId: recipe._id,
        title: recipe.title,
        image: `${window.location.origin}/` + recipe.image,
        origin: window.location.origin, // 🆕 əlavə olunur
      });
      window.location.href = res.data.url;
    } catch (err) {
      console.error('Ödəniş baş tutmadı:', err);
      alert('Ödəniş səhv ilə nəticələndi.');
      setLoading(false);
    }
  };

  if (!recipe) return <p>Yüklənir...</p>;

  return (
    <div className={styles.container}>
      <img
        className={styles.image}
        src={`${window.location.origin}/${recipe.image}`}
        alt={recipe.title}
      />
      <h1>{recipe.title}</h1>
      <p><strong>Kateqoriya:</strong> {recipe.category}</p>
      <p><strong>Ərzaqlar:</strong> {recipe.ingredients.join(', ')}</p>
      <button onClick={handlePayment} className={styles.button} disabled={loading}>
        {loading ? 'Yönləndirilir...' : '💳 Ödəniş et və bax'}
      </button>
    </div>
  );
};

export default PremiumDetail;
