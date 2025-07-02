import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFavorites, removeFavorite } from '../../services/axiosInstance';
import styles from './Favorites.module.css';
import GreenLoader from '../../components/common/GreenLoader';
import Swal from 'sweetalert2';
import { FaCommentDots } from 'react-icons/fa';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem('accessToken');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    const fetchFavorites = async () => {
      try {
        const data = await getFavorites();
        const filtered = data.filter(f => f.recipe !== null).map(f => f.recipe);
        setFavorites(filtered);
      } catch (err) {
        console.error('Favoritləri yükləmək olmadı:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFavorites();
  }, [token, navigate]);

  const handleRemove = async (recipeId) => {
    const result = await Swal.fire({
      title: 'Əminsiniz?',
      text: 'Bu resepti sevimlilərdən silmək istəyirsiniz?',
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
    });

    if (result.isConfirmed) {
      try {
        await removeFavorite(recipeId);
        setFavorites(prev => prev.filter(recipe => recipe._id !== recipeId));
        Swal.fire({
          title: 'Silindi!',
          text: 'Sevimlilərdən uğurla silindi.',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        });
      } catch (err) {
        console.error("Silinmə zamanı xəta:", err);
        Swal.fire({
          title: 'Xəta!',
          text: 'Silinmə mümkün olmadı.',
          icon: 'error'
        });
      }
    }
  };

  const handleDetail = (recipe) => {
    if (recipe.isPremium) {
      navigate(`/premium/${recipe._id}`);
    } else {
      navigate(`/recipe/${recipe._id}`);
    }
  };

  const openComments = (recipeId) => {
    navigate(`/comments/${recipeId}`);
  };

  if (isLoading) return <GreenLoader />;

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Sevdiyiniz Reseptlər</h2>
      {favorites.length === 0 ? (
        <div className={styles.noRecipeWrapper}>
          <p className={styles.noRecipe}>Sevdiyiniz respet yoxdur.</p>
        </div>
      ) : (
        <div className={styles.recipeList}>
          {favorites.map(recipe => (
            <div key={recipe._id} className={styles.card}>
              {recipe.isPremium && <div className={styles.premiumLabel}>★ Premium</div>}
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
                  <button onClick={() => handleRemove(recipe._id)}>
                    <span
                      dangerouslySetInnerHTML={{
                        __html: `
                        <lord-icon
                          src="https://cdn.lordicon.com/drxwpfop.json"
                          trigger="hover"
                          colors="primary:#fff,secondary:#ffdd57"
                          style="width:26px;height:26px">
                        </lord-icon>
                      `,
                      }}
                    />
                  </button>
                  <button onClick={() => openComments(recipe._id)}>
                    <FaCommentDots />
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
              <button className={styles.detailBtnFull} onClick={() => handleDetail(recipe)}>
                Ətraflı bax
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;
