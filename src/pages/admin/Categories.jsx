import { useEffect, useState } from 'react';
import axiosInstance from '../../services/axiosInstance';
import { toast } from 'react-toastify';
import Loader from '../../components/common/Loader';
import Swal from 'sweetalert2';
import 'animate.css';
import styles from './AdminPanel.module.css';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get('/admin/categories');
      setCategories(res.data);
    } catch (err) {
      toast.error('❌ Kateqoriyalar yüklənmədi');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAdd = async () => {
    if (!newCategory.trim()) {
      toast.warning('⚠️ Kateqoriya adı boş ola bilməz');
      return;
    }
    try {
      await axiosInstance.post('/admin/categories', { name: newCategory });
      toast.success('✅ Kateqoriya əlavə olundu');
      setNewCategory('');
      fetchCategories();
    } catch (err) {
      toast.error('❌ Əlavə olunmadı');
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Silmək istəyirsiniz?',
      text: 'Bu əməliyyati geri qaytarmaq olmaz!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sil',
      cancelButtonText: 'Ləğv et',
      customClass: {
        popup: 'animate__animated animate__fadeInDown',
      },
    });

    if (result.isConfirmed) {
      try {
        await axiosInstance.delete(`/admin/categories/${id}`);
        fetchCategories();
        Swal.fire({
          icon: 'success',
          title: 'Silindi',
          showConfirmButton: false,
          timer: 1500,
          customClass: {
            popup: 'animate__animated animate__fadeOutUp',
          },
        });
      } catch (err) {
        Swal.fire({
          icon: 'error',
          title: 'Xəta',
          text: 'Silinmədi',
        });
      }
    }
  };

  if (loading) return <Loader />;

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Kateqoriyalar</h2>

      <div className={styles.categoryForm}>
        <input
          className={styles.input}
          placeholder="Yeni kateqoriya"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
        />
        <button className={styles.addBtn} onClick={handleAdd}>
          Əlavə et
        </button>
      </div>

      <ul className={styles.userList}>
        {categories.map((cat) => (
          <li key={cat._id} className={styles.userItem}>
            <span className={styles.userInfo}>{cat.name}</span>
            <button className={styles.deleteBtn} onClick={() => handleDelete(cat._id)}>
              Sil
            </button>
          </li>
        ))}
      </ul>

      {categories.length === 0 && (
        <p className={styles.empty}>Kateqoriya yoxdur</p>
      )}
    </div>
  );
};

export default Categories;
