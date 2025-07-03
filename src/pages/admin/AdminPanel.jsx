import { useEffect, useState } from 'react';
import axiosInstance from '../../services/axiosInstance';
import styles from './AdminPanel.module.css';
import Loader from '../../components/common/Loader';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

const AdminPanel = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [payments, setPayments] = useState([]);
  const [comments, setComments] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");

  const fetchAll = async () => {
    try {
      const [statsRes, usersRes, recipesRes, paymentsRes, commentsRes, categoriesRes] = await Promise.all([
        axiosInstance.get("/admin/stats"),
        axiosInstance.get("/admin/users"),
        axiosInstance.get("/admin/recipes"),
        axiosInstance.get("/admin/payments"),
        axiosInstance.get("/admin/comments"),
        axiosInstance.get("/admin/categories")
      ]);

      setStats(statsRes.data);
      setUsers(usersRes.data);
      setRecipes(recipesRes.data);
      setPayments(paymentsRes.data);
      setComments(commentsRes.data);
      setCategories(categoriesRes.data);
    } catch (err) {
      toast.error("❌ Məlumatlar yüklənmədi");
      console.error("Admin panel məlumatları yüklənmədi:", err);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleDelete = async (type, id) => {
    const result = await Swal.fire({
      title: 'Silmək istədiyinizə əminsiniz?',
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
        await axiosInstance.delete(`/admin/${type}/${id}`);
        toast.success("✅ Uğurla silindi");
        fetchAll();
      } catch (err) {
        toast.error("❌ Silinmə zamanı xəta baş verdi");
      }
    }
  };

  const handleRoleToggle = async (id, isAdmin) => {
    const result = await Swal.fire({
      title: isAdmin ? "Adminliyi ləğv etmək istəyirsiniz?" : "İstifadəçini admin etmək istəyirsiniz?",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#6bae6e',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Bəli',
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
        await axiosInstance.put(`/admin/users/${id}/role`, { isAdmin: !isAdmin });
        toast.success("✅ Rol yeniləndi");
        fetchAll();
      } catch (err) {
        toast.error("❌ Rol dəyişdirilmədi");
      }
    }
  };

  const handleAddCategory = async () => {
    if (!newCategory.trim()) {
      toast.warning("⚠️ Kateqoriya adı boş ola bilməz");
      return;
    }
    try {
      await axiosInstance.post('/admin/categories', { name: newCategory });
      toast.success("✅ Kateqoriya əlavə olundu");
      setNewCategory("");
      fetchAll();
    } catch (err) {
      toast.error("❌ Kateqoriya əlavə olunmadı");
    }
  };

  if (!stats) return <Loader />;

  return (
    <div className={styles.panel}>
      <h2>Admin Panel</h2>

      <div className={styles.cards}>
        <div className={styles.card}>
          <h3>İstifadəçilər</h3>
          <p>{stats.userCount}</p>
        </div>
        <div className={styles.card}>
          <h3>Reseptlər</h3>
          <p>{stats.recipeCount}</p>
        </div>
        <div className={styles.card}>
          <h3>Kateqoriyalar</h3>
          <p>{stats.categoryCount}</p>
        </div>
        <div className={styles.card}>
          <h3>Gəlir</h3>
          <p>{stats.totalIncome} ₼</p>
        </div>
      </div>

      <div className={styles.newCategory}>
        <h3>Yeni Kateqoriya</h3>
        <div className={styles.categoryForm}>
          <input
            value={newCategory}
            onChange={e => setNewCategory(e.target.value)}
            placeholder="Kateqoriya adı..."
            className={styles.input}
          />
          <button onClick={handleAddCategory} className={styles.button}>Əlavə et</button>
        </div>
      </div>

      {/* İstifadəçilər */}
      <div className={styles.section}>
        <h3>İstifadəçilər</h3>
        {users.length === 0 ? (
          <p className={styles.empty}>İstifadəçi yoxdur</p>
        ) : (
          <ul className={styles.list}>
            {users.map(u => (
              <li key={u._id} className={styles.item}>
                <div className={styles.itemInfo}>
                  {u.username} ({u.email})
                  <div className={styles.role}>{u.isAdmin ? "Admin" : "İstifadəçi"}</div>
                </div>

                <div className={styles.buttonsGroup}>
                  <button
                    onClick={() => handleRoleToggle(u._id, u.isAdmin)}
                    className={styles.editBtn}
                  >
                    {u.isAdmin ? "Adminliyi Sil" : "Admin et"}
                  </button>
                  <button
                    onClick={() => handleDelete("users", u._id)}
                    className={styles.deleteBtn}
                  >
                    Sil
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Reseptlər */}
      <div className={styles.section}>
        <h3>Reseptlər</h3>
        {recipes.length === 0 ? (
          <p className={styles.empty}>Resept yoxdur</p>
        ) : (
          <ul className={styles.list}>
            {recipes.map(r => (
              <li key={r._id} className={styles.item}>
                <div className={styles.itemInfo}>{r.title}</div>
                <div className={styles.buttonsGroup}>
                  <button
                    onClick={() => handleDelete("recipes", r._id)}
                    className={styles.deleteBtn}
                  >
                    Sil
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Ödənişlər */}
      <div className={styles.section}>
        <h3>Ödənişlər</h3>
        {payments.length === 0 ? (
          <p className={styles.empty}>Ödəniş yoxdur</p>
        ) : (
          <ul className={styles.list}>
            {payments.map(p => (
              <li key={p._id} className={styles.item}>
                {p.user?.username} → {p.recipe?.title} ({p.amount} ₼)
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Kateqoriyalar */}
      <div className={styles.section}>
        <h3>Kateqoriyalar</h3>
        {categories.length === 0 ? (
          <p className={styles.empty}>Kateqoriya yoxdur</p>
        ) : (
          <ul className={styles.list}>
            {categories.map(c => (
              <li key={c._id} className={styles.item}>
                <div className={styles.itemInfo}>{c.name}</div>
                <div className={styles.buttonsGroup}>
                  <button
                    onClick={() => handleDelete("categories", c._id)}
                    className={styles.deleteBtn}
                  >
                    Sil
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Şərhlər */}
      <div className={styles.section}>
        <h3>Şərhlər</h3>
        {comments.length === 0 ? (
          <p className={styles.empty}>Şərh yoxdur</p>
        ) : (
          <ul className={styles.list}>
            {comments.map(c => (
              <li key={c._id} className={styles.item}>
                <div className={styles.itemInfo}>
                  <b>{c.user?.username}</b>: {c.content}
                </div>
                <div className={styles.buttonsGroup}>
                  <button
                    onClick={() => handleDelete("comments", c._id)}
                    className={styles.deleteBtn}
                  >
                    Sil
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
