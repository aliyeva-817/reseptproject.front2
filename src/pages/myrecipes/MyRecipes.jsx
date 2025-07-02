import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../../services/axiosInstance';
import styles from './MyRecipes.module.css';
import { FaCommentDots, FaTrashAlt } from 'react-icons/fa';
import GreenLoader from '../../components/common/GreenLoader';
import Swal from 'sweetalert2';
import 'animate.css';

const MyRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyRecipes = async () => {
      try {
        const res = await axiosInstance.get('/recipes/my');
        setRecipes(res.data);
      } catch (err) {
        console.error('Mənim reseptlərim alınmadı:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMyRecipes();
  }, []);

  const handleDelete = (recipeId) => {
    Swal.fire({
      title: 'Əminsiniz?',
      text: 'Bu resepti silmək istəyirsiniz?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#6bae6e',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Bəli, sil',
      cancelButtonText: 'İmtina',
      showClass: {
        popup: 'animate__animated animate__fadeInDown'
      },
      hideClass: {
        popup: 'animate__animated animate__fadeOutUp'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        deleteRecipe(recipeId);
      }
    });
  };

  const deleteRecipe = async (recipeId) => {
    try {
      await axiosInstance.delete(`/recipes/${recipeId}`);
      setRecipes(prev => prev.filter(r => r._id !== recipeId));
      Swal.fire({
        title: 'Silindi!',
        text: 'Resept uğurla silindi.',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false
      });
    } catch (err) {
      console.error('Silinmə xətası:', err);
      Swal.fire({
        title: 'Xəta!',
        text: err?.response?.data?.error || 'Resept silinərkən xəta baş verdi.',
        icon: 'error'
      });
    }
  };

  const goToCommentsPage = (id) => {
    navigate(`/comments/${id}`);
  };

  if (isLoading) return <GreenLoader />;

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Mənim Reseptlərim</h2>
      {recipes.length === 0 ? (
        <div className={styles.noRecipeWrapper}>
          <p className={styles.noRecipe}>Sizin hələ reseptiniz yoxdur.</p>
          <Link to="/add" className={styles.addRecipeLink}>Resept əlavə et</Link>
        </div>
      ) : (
        <div className={styles.recipeList}>
          {recipes.map(recipe => (
            <div key={recipe._id} className={styles.card}>
              <div className={styles.imageWrapper}>
                <img
                  src={
                    recipe.image?.includes('uploads/')
                      ? `http://localhost:5000/${recipe.image}`
                      : `http://localhost:5000/uploads/${recipe.image}`
                  }
                  alt={recipe.title}
                  className={styles.image}
                />
                <div className={styles.iconOverlay}>
                  <button onClick={() => goToCommentsPage(recipe._id)} className={styles.commentBtn}>
                    <FaCommentDots />
                  </button>
                  <button onClick={() => handleDelete(recipe._id)} className={styles.deleteBtn}>
                    <FaTrashAlt />
                  </button>
                </div>
              </div>
              <h3>{recipe.title}</h3>
              <div className={styles.greenLines}>
                <div className={`${styles.line} ${styles.full}`}></div>
                <div className={`${styles.line} ${styles.short}`}></div>
              </div>
              <div className={styles.ingredientCarousel}>
                {recipe.ingredients?.map((ing, i) => (
                  <span key={i} className={styles.ingredientTag}>{ing}</span>
                ))}
              </div>
              <button className={styles.detailBtnFull}>
                <Link to={`/recipe/${recipe._id}`} className={styles.linkText}>Ətraflı bax</Link>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyRecipes;
