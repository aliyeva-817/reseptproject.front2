import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../../services/axiosInstance';
import styles from './MyRecipes.module.css';
import CommentSection from '../../components/comments/CommentSection';

const MyRecipes = () => {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    const fetchMyRecipes = async () => {
      try {
        const res = await axiosInstance.get('/recipes/my');
        setRecipes(res.data);
      } catch (err) {
        console.error('Mənim reseptlərim alınmadı:', err);
      }
    };

    fetchMyRecipes();
  }, []);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Mənim Reseptlərim</h2>
      {recipes.length === 0 ? (
        <p className={styles.noRecipe}>Sizin hələ reseptiniz yoxdur.</p>
      ) : (
        <div className={styles.grid}>
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
              <h3 className={styles.recipeTitle}>{recipe.title}</h3>
              <div className={styles.btnGroup}>
                <Link to={`/recipe/${recipe._id}`} className={styles.detailBtn}>
                  Ətraflı bax
                </Link>
              </div>
              <CommentSection recipeId={recipe._id} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyRecipes;
