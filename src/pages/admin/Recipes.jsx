import { useEffect, useState } from 'react';
import axiosInstance from '../../services/axiosInstance';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import styles from './Recipes.module.css';  // Aşağıda CSS verilir

const Recipes = () => {
  const [recipes, setRecipes] = useState([]);

  const fetchRecipes = async () => {
    try {
      const res = await axiosInstance.get('/admin/recipes');
      setRecipes(res.data);
    } catch (err) {
      console.error("Reseptlər yüklənmədi:", err);
      Swal.fire({
        icon: 'error',
        title: 'Xəta',
        text: 'Reseptlər yüklənmədi.',
      });
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Əminsiniz?',
      text: 'Resepti silmək istəyirsiniz?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
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
        await axiosInstance.delete(`/admin/recipes/${id}`);
        Swal.fire({
          icon: 'success',
          title: 'Silindi!',
          text: 'Resept uğurla silindi.',
          timer: 1500,
          showConfirmButton: false,
        });
        fetchRecipes();
      } catch (err) {
        Swal.fire({
          icon: 'error',
          title: 'Xəta',
          text: 'Silinmə zamanı xəta baş verdi.',
        });
      }
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Reseptlər</h2>
      <ul className={styles.recipeList}>
        {recipes.map((r) => (
          <li key={r._id} className={styles.recipeItem}>
            <span className={styles.recipeInfo}>
              {r.title} — {r.user?.username}
            </span>
            <button
              className={styles.deleteBtn}
              onClick={() => handleDelete(r._id)}
              aria-label={`Delete recipe ${r.title}`}
            >
              Sil
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Recipes;
