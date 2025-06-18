import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import styles from './AddRecipe.module.css';

const AddRecipe = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem('accessToken');
    if (!token) {
      alert('Giriş etməlisiniz');
      navigate('/login');
      return;
    }

    const formData = new FormData(e.target);

    try {
      const res = await axios.post('http://localhost:5000/api/recipes', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        },
        withCredentials: true // Əlavə et: bəzən lazımdır CORS üçün
      });

      alert("Resept əlavə olundu!");
      navigate('/home');
    } catch (err) {
      console.error('Resept göndərilmədi:', err);
      if (err.response) {
        console.error('Server cavabı:', err.response.data);
      }
      alert("Xəta baş verdi. Əlavə edilə bilmədi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form} encType="multipart/form-data">
      <h2>Yeni Resept Əlavə Et</h2>
      <input name="title" placeholder="Başlıq" required />
      <input name="ingredients" placeholder="un, yumurta..." required />
      <textarea name="instructions" placeholder="Hazırlanma qaydası" required />
      <input type="file" name="image" accept="image/*" required />
      <button disabled={loading}>{loading ? 'Göndərilir...' : 'Əlavə et'}</button>
    </form>
  );
};

export default AddRecipe;
