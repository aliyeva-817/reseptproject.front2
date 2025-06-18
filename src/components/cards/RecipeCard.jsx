import React from 'react';
import { useNavigate } from 'react-router-dom';

const RecipeCard = ({ recipe }) => {
  const navigate = useNavigate();

  return (
    <div onClick={() => navigate(`/recipes/${recipe._id}`)}>
      <img src={`http://localhost:5000/${recipe.image}`} alt={recipe.title} />
      <h3>{recipe.title}</h3>
    </div>
  );
};

export default RecipeCard;
