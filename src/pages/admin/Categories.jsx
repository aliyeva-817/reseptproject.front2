import { useEffect, useState } from 'react';
import axiosInstance from '../../services/axiosInstance';
import { toast } from 'react-toastify';
import Loader from '../../components/common/Loader';
import styles from './AdminPanel.module.css';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get('/admin/categories');
      setCategories(res.data);
    } catch (err) {
      toast.error("❌ Kateqoriyalar yüklənmədi");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAdd = async () => {
    if (!newCategory.trim()) {
      toast.warning("⚠️ Kateqoriya adı boş ola bilməz");
      return;
    }
    try {
      await axiosInstance.post('/admin/categories', { name: newCategory });
      toast.success("✅ Kateqoriya əlavə olundu");
      setNewCategory("");
      fetchCategories();
    } catch (err) {
      toast.error("❌ Əlavə olunmadı");
    }
  };

  const handleDelete = (id) => {
    const toastId = toast.info(
      <div>
        <p>Silinsin?</p>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
          <button
            onClick={async () => {
              toast.update(toastId, { render: "Silinir...", type: "info", autoClose: 1000, isLoading: true });
              try {
                await axiosInstance.delete(`/admin/categories/${id}`);
                fetchCategories();
                toast.update(toastId, { render: "✅ Silindi", type: "success", isLoading: false, autoClose: 2000 });
              } catch (err) {
                toast.update(toastId, { render: "❌ Silinmədi", type: "error", isLoading: false, autoClose: 2000 });
              }
            }}
            style={{
              backgroundColor: '#d32f2f',
              color: '#fff',
              border: 'none',
              padding: '6px 12px',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Sil
          </button>
          <button
            onClick={() => toast.dismiss(toastId)}
            style={{
              backgroundColor: '#555',
              color: '#fff',
              border: 'none',
              padding: '6px 12px',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Ləğv et
          </button>
        </div>
      </div>,
      { autoClose: false, closeOnClick: false }
    );
  };

  if (loading) return <Loader />;

  return (
    <div className={styles.panel}>
      <h2>Kateqoriyalar</h2>
      <div className={styles.categoryForm}>
        <input
          className={styles.input}
          placeholder="Yeni kateqoriya"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
        />
        <button className={styles.button} onClick={handleAdd}>Əlavə et</button>
      </div>

      {categories.length === 0 ? (
        <p className={styles.empty}>Kateqoriya yoxdur</p>
      ) : (
        <ul className={styles.list}>
          {categories.map((c) => (
            <li key={c._id} className={styles.item}>
              {c.name}
              <button className={styles.deleteBtn} onClick={() => handleDelete(c._id)}>Sil</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Categories;
