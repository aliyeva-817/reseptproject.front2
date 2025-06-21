import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../../services/axiosInstance';
import styles from './CategoryPage.module.css';

const CategoryPage = () => {
  const { categoryName } = useParams();
  const [recipes, setRecipes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchByCategory = async () => {
      try {
        const res = await axiosInstance.get(`/recipes/category/search?category=${categoryName}`);
        setRecipes(res.data);
      } catch (err) {
        console.error('Kategoriya yükləmə xətası:', err);
      }
    };

    fetchByCategory();
  }, [categoryName]);

  return (
    <div className={styles.wrapper}>
      <h2>{categoryName} reseptləri</h2>
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
            <button onClick={() => navigate(`/recipe/${recipe._id}`)} className={styles.detailBtn}>
              Ətraflı bax
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryPage;
