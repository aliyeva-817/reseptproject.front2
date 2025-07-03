import { useEffect, useState } from 'react';
import axiosInstance from '../../services/axiosInstance';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import styles from './Users.module.css';  // Aşağıda verəcəyim CSS faylı

const Users = () => {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const res = await axiosInstance.get('/admin/users');
      setUsers(res.data);
    } catch (err) {
      console.error("İstifadəçilər yüklənmədi:", err);
      Swal.fire({
        icon: 'error',
        title: 'Xəta',
        text: 'İstifadəçilər yüklənmədi.',
      });
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Əminsiniz?',
      text: 'İstifadəçini silmək istəyirsiniz?',
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
        await axiosInstance.delete(`/admin/users/${id}`);
        Swal.fire({
          icon: 'success',
          title: 'Silindi!',
          text: 'İstifadəçi uğurla silindi.',
          timer: 1500,
          showConfirmButton: false,
        });
        fetchUsers();
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
    fetchUsers();
  }, []);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>İstifadəçilər</h2>
      <ul className={styles.userList}>
        {users.map((u) => (
          <li key={u._id} className={styles.userItem}>
            <span className={styles.userInfo}>
              {u.username} ({u.email}) — {new Date(u.createdAt).toLocaleDateString()}
            </span>
            <button
              className={styles.deleteBtn}
              onClick={() => handleDelete(u._id)}
              aria-label={`Delete user ${u.username}`}
            >
              Sil
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Users;
