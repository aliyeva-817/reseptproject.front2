import React, { useEffect, useState } from 'react';
import axiosInstance from '../../services/axiosInstance';
import RecipeCard from '../../components/RecipeCard';

const RecipeList = () => {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    const fetchRecipes = async () => {
      const res = await axiosInstance.get('/recipes');
      setRecipes(res.data);
    };
    fetchRecipes();
  }, []);

  return (
    <div>
      <h2>Bütün Reseptlər</h2>
      <div>
        {recipes.map(recipe => (
          <RecipeCard key={recipe._id} recipe={recipe} />
        ))}
      </div>
    </div>
  );
};

export default RecipeList;
