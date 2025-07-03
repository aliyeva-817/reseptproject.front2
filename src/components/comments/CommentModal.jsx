import React, { useEffect, useState } from 'react';
import styles from './CommentModal.module.css';
import { FaTimes, FaHeart, FaTrash, FaReply } from 'react-icons/fa';
import axiosInstance from '../../services/axiosInstance';
import Swal from 'sweetalert2';
import 'animate.css';
import avokado from '../../assets/food/avokado.png';

const CommentModal = ({ recipeId, onClose }) => {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState('');
  const [error, setError] = useState('');
  const [replyText, setReplyText] = useState('');
  const [activeReplyId, setActiveReplyId] = useState(null);
  const [hideInput, setHideInput] = useState(false);
  const userId = localStorage.getItem('userId');

  const fetchComments = async () => {
    try {
      const res = await axiosInstance.get(`/comments/${recipeId}`);
      setComments(res.data);
    } catch (err) {
      console.error('Şərhləri yükləmək olmadı:', err);
    }
  };

  const handleAddComment = async () => {
    if (!text.trim()) return setError('Zəhmət olmasa şərh yazın');
    try {
      const res = await axiosInstance.post('/comments', { recipeId, text });
      setComments([res.data, ...comments]);
      setText('');
      setError('');
    } catch (err) {
      console.error('Şərh əlavə olunmadı:', err);
      setError(err.response?.data?.error || 'Xəta baş verdi');
    }
  };

  const handleReply = async (commentId) => {
    if (!replyText.trim()) return;
    try {
      const res = await axiosInstance.post(`/comments/${commentId}/reply`, { text: replyText });
      setComments(comments.map(c =>
        c._id === commentId ? res.data : c
      ));
      setReplyText('');
      setActiveReplyId(null);
    } catch (err) {
      console.error('Cavab əlavə olunmadı:', err);
    }
  };

  const handleLike = async (commentId) => {
    try {
      const res = await axiosInstance.patch(`/comments/${commentId}/like`);
      setComments(comments.map(c =>
        c._id === commentId ? { ...c, likes: Array(res.data.likes).fill('dummy') } : c
      ));
    } catch (err) {
      console.error('Like xətası:', err);
    }
  };

  const handleDelete = async (commentId) => {
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
        await axiosInstance.delete(`/comments/${commentId}`);
        setComments(comments.filter(c => c._id !== commentId));
      } catch (err) {
        console.error('Silinmə xətası:', err);
      }
    }
  };

  // Footer görünəndə input gizlətmək üçün scroll yoxlama
  useEffect(() => {
    const footer = document.getElementById('footer');
    if (!footer) return;

    const onScroll = () => {
      const footerTop = footer.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;
      setHideInput(footerTop < windowHeight);
    };

    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    fetchComments();
  }, [recipeId]);

  return (
    <div className={styles.overlay} onClick={onClose}>
      {/* ✅ Avokado arxa fon */}
      <div className={styles.avocadoBackground}>
        {[...Array(10)].map((_, i) => (
          <img key={i} src={avokado} alt="avokado" className={styles.avocadoItem} />
        ))}
      </div>

      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className={styles.closeBtn}><FaTimes /></button>
        <h3 className={styles.basliq}>Şərhlər</h3>

        <div className={styles.commentList}>
          {comments.map((comment) => (
            <div key={comment._id} className={styles.comment}>
              <div className={styles.commentHeader}>
                <p><strong>{comment.user?.name || 'Anonim'}:</strong> {comment.content}</p>
                <div className={styles.commentActions}>
                  <button onClick={() => handleLike(comment._id)} className={styles.iconButton}>
                    <FaHeart className={styles.icon} />
                    <span style={{ marginLeft: '6px' }}>{comment.likes.length}</span>
                  </button>
                  <button onClick={() => setActiveReplyId(comment._id)}>
                    <FaReply className={styles.icon} />
                  </button>
                  {comment.user?._id === userId && (
                    <button onClick={() => handleDelete(comment._id)}>
                      <FaTrash className={styles.icon} />
                    </button>
                  )}
                </div>
              </div>

              {comment.replies?.map((reply, idx) => (
                <div key={idx} className={styles.reply}>
                  <p><strong>{reply.user?.name || 'Anonim'}:</strong> {reply.content}</p>
                </div>
              ))}

              {activeReplyId === comment._id && (
                <div className={styles.replyInput}>
                  <input
                    className={styles.replyText}
                    type="text"
                    placeholder="Cavab yazın..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                  />
                  <button className={styles.replyBtn} onClick={() => handleReply(comment._id)}>Cavabla</button>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className={`${styles.inputArea} ${hideInput ? styles.hidden : ''}`}>
          <div className={styles.inputRow}>
            <input
              type="text"
              placeholder="Şərhinizi yazın..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <button onClick={handleAddComment}>Göndər</button>
          </div>
          {error && <p className={styles.error}>{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default CommentModal;
