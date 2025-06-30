import React, { useState } from 'react';
import axiosInstance from '../../services/axiosInstance';
import styles from './AddRecipe.module.css';

import food1 from '../../assets/food/food1.png';
import food2 from '../../assets/food/food2.png';
import food3 from '../../assets/food/food3.png';
import food4 from '../../assets/food/food4.png';
import bgImage from '../../assets/food/arxa fon.webp';
import GreenLoader from '../../components/common/GreenLoader'; // ✅ Loader import

const AddRecipe = () => {
  const [title, setTitle] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [instructions, setInstructions] = useState('');
  const [category, setCategory] = useState('');
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false); // ✅

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // ✅ Loader göstərilsin
    const formData = new FormData();
    formData.append('title', title);
    formData.append('ingredients', ingredients);
    formData.append('instructions', instructions);
    formData.append('category', category);
    formData.append('image', image);
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
    } finally {
      setIsLoading(false); // ✅ Yükləmə bitdi
    }
  };

  if (isLoading) return <GreenLoader />; // ✅ Yalnız submit zamanı loader

  return (
    <div
      className={styles.pageBackground}
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className={styles.overlay}>
        <div className={styles.container}>
          <img src={food1} className={`${styles.foodImage} ${styles.img1}`} alt="food1" />
          <img src={food2} className={`${styles.foodImage} ${styles.img2}`} alt="food2" />
          <img src={food3} className={`${styles.foodImage} ${styles.img3}`} alt="food3" />
          <img src={food4} className={`${styles.foodImage} ${styles.img4}`} alt="food4" />

          <h2 className={styles.yazi}>Resept Əlavə Et</h2>
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
      </div>
    </div>
  );
};

export default AddRecipe;
