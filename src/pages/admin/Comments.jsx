import { useEffect, useState } from 'react';
import axiosInstance from '../../services/axiosInstance';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import styles from './Comments.module.css';
import { FaCommentSlash } from 'react-icons/fa';

const Comments = () => {
  const [comments, setComments] = useState([]);

  const fetchComments = async () => {
    try {
      const res = await axiosInstance.get('/admin/comments');
      setComments(res.data);
    } catch (err) {
      console.error("Şərhlər yüklənmədi:", err);
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Əminsiniz?',
      text: 'Bu şərhi silmək istəyirsiniz?',
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
        await axiosInstance.delete(`/admin/comments/${id}`);
        fetchComments();
        Swal.fire({
          icon: 'success',
          title: 'Şərh silindi',
          timer: 1500,
          showConfirmButton: false,
        });
      } catch (err) {
        Swal.fire({
          icon: 'error',
          title: 'Xəta',
          text: 'Şərh silinmədi',
        });
      }
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  return (
    <div className={styles.container}>
      {comments.length === 0 ? (
        <div className={styles.emptyBox}>
          <FaCommentSlash size={60} className={styles.emptyIcon} />
          <p className={styles.emptyText}>Şərh yoxdur</p>
        </div>
      ) : (
        <ul className={styles.commentList}>
          {comments.map((c) => (
            <li key={c._id} className={styles.commentItem}>
              <span className={styles.commentInfo}>
                <strong>{c.user?.username || 'Anonim'}</strong>: {c.content}
              </span>
              <button
                className={styles.deleteBtn}
                onClick={() => handleDelete(c._id)}
                aria-label="Şərhi sil"
              >
                Sil
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Comments;
