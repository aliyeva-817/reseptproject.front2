import React, { useState } from 'react';
import axiosInstance from '../../services/axiosInstance';
import styles from './AddRecipe.module.css';

const AddRecipe = () => {
  const [title, setTitle] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [instructions, setInstructions] = useState('');
  const [category, setCategory] = useState('');
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
  e.preventDefault();
  const formData = new FormData();
  formData.append('title', title);
  formData.append('ingredients', ingredients);
  formData.append('instructions', instructions);
  formData.append('category', category);
  formData.append('image', image);

  // ✅ Admin panelindən göndərilənlərdə bu sahə əlavə edilir
  formData.append('addedByAdmin', true);

  try {
    const res = await axiosInstance.post('/recipes', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    setMessage('Resept uğurla əlavə olundu!');
    setTitle('');
    setIngredients('');
    setInstructions('');
    setCategory('');
    setImage(null);
  } catch (err) {
    setMessage('Xəta baş verdi. Zəhmət olmasa yenidən cəhd edin.');
    console.error('Error uploading recipe:', err);
  }
};


  return (
    <div className={styles.container}>
      <h2>Resept Əlavə Et</h2>
      {message && <p className={styles.message}>{message}</p>}
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          placeholder="Yeməyin adı"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Ərzaqlar (vergüllə ayırın)"
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          required
        />
        <textarea
          placeholder="Hazırlanma qaydası"
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Kategoriya (məs: fastfood, desert, soup)"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          required
        />
        <button type="submit">Əlavə et</button>
      </form>
    </div>
  );
};

export default AddRecipe;
