import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../../services/axiosInstance';
import styles from './PremiumDetail.module.css';
import GreenLoader from '../../components/common/GreenLoader';

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
        image: `http://localhost:5000/${recipe.image?.includes('uploads/') ? recipe.image : 'uploads/' + recipe.image}`,
        origin: window.location.origin,
      });
      window.location.href = res.data.url;
    } catch (err) {
      console.error('Ödəniş baş tutmadı:', err);
      alert('Ödəniş səhv ilə nəticələndi.');
      setLoading(false);
    }
  };

  if (!recipe) return <GreenLoader />;

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <img
          className={styles.image}
          src={
            recipe.image?.includes('uploads/')
              ? `http://localhost:5000/${recipe.image}`
              : `http://localhost:5000/uploads/${recipe.image}`
          }
          alt={recipe.title}
        />
        <h1 className={styles.title}>{recipe.title}</h1>

        <button
          onClick={handlePayment}
          className={styles.button}
          disabled={loading}
        >
          {loading ? 'Yönləndirilir...' : 'Ödəniş et və bax'}
        </button>
      </div>
    </div>
  );
};

export default PremiumDetail;
