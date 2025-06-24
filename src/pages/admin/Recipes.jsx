// src/pages/admin/Recipes.jsx
import { useEffect, useState } from 'react';
import axiosInstance from '../../services/axiosInstance';

const Recipes = () => {
  const [recipes, setRecipes] = useState([]);

  const fetchRecipes = async () => {
    try {
      const res = await axiosInstance.get('/admin/recipes');
      setRecipes(res.data);
    } catch (err) {
      console.error("Reseptlər yüklənmədi:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Resept silinsin?")) return;
    try {
      await axiosInstance.delete(`/admin/recipes/${id}`);
      fetchRecipes();
    } catch (err) {
      alert("Silinmə zamanı xəta baş verdi.");
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  return (
    <div>
      <h2>Reseptlər</h2>
      <ul>
        {recipes.map((r) => (
          <li key={r._id}>
            {r.title} — {r.user?.username}
            <button onClick={() => handleDelete(r._id)}>Sil</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Recipes;
