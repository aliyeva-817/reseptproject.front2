import React, { useEffect, useState } from 'react';
import styles from './CommentModal.module.css';
import { FaTimes, FaHeart, FaTrash, FaReply } from 'react-icons/fa';
import axiosInstance from '../../services/axiosInstance';

const CommentModal = ({ recipeId, onClose }) => {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState('');
  const [error, setError] = useState('');
  const [replyText, setReplyText] = useState('');
  const [activeReplyId, setActiveReplyId] = useState(null);
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
    if (!window.confirm('Şərhi silmək istədiyinizə əminsiniz?')) return;
    try {
      await axiosInstance.delete(`/comments/${commentId}`);
      setComments(comments.filter(c => c._id !== commentId));
    } catch (err) {
      console.error('Silinmə xətası:', err);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [recipeId]);

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button onClick={onClose} className={styles.closeBtn}><FaTimes /></button>
        <h3>Şərhlər</h3>

        <div className={styles.inputArea}>
          <textarea
            placeholder="Şərhinizi yazın..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button onClick={handleAddComment}>Göndər</button>
        </div>
        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.commentList}>
          {comments.map((comment) => (
            <div key={comment._id} className={styles.comment}>
              <p><strong>{comment.user?.name || 'Anonim'}:</strong> {comment.content}</p>
              <div className={styles.commentActions}>
                <button onClick={() => handleLike(comment._id)}>
                  <FaHeart /> {comment.likes.length}
                </button>
                <button onClick={() => setActiveReplyId(comment._id)}>
                  <FaReply />
                </button>
                {comment.user?._id === userId && (
                  <button onClick={() => handleDelete(comment._id)}>
                    <FaTrash />
                  </button>
                )}
              </div>

              {/* Replies */}
              {comment.replies?.map((reply, idx) => (
                <div key={idx} className={styles.reply}>
                  <p><strong>{reply.user?.name || 'Anonim'}:</strong> {reply.content}</p>
                </div>
              ))}

              {/* Reply Input */}
              {activeReplyId === comment._id && (
                <div className={styles.replyInput}>
                  <textarea
                    placeholder="Cavab yazın..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                  />
                  <button onClick={() => handleReply(comment._id)}>Cavab ver</button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CommentModal;
