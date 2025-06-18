import React, { useEffect, useState } from 'react';
import styles from './CommentModal.module.css';
import axiosInstance from '../../services/axiosInstance';
import { useSelector } from 'react-redux';

const CommentModal = ({ recipeId, onClose }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState(null);
  const user = useSelector((state) => state.user.user);
  const token = localStorage.getItem('accessToken');

  const fetchComments = async () => {
    try {
      const res = await axiosInstance.get(`/comments/${recipeId}`);
      setComments(res.data);
    } catch (err) {
      console.error('Şərhləri gətirmək mümkün olmadı:', err);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    try {
      if (replyTo) {
        await axiosInstance.post(
          `/comments/${replyTo}/reply`,
          { text: newComment },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axiosInstance.post(
          '/comments',
          { recipeId, text: newComment },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      setNewComment('');
      setReplyTo(null);
      fetchComments();
    } catch (err) {
      console.error('Şərh göndərilə bilmədi:', err);
    }
  };

  const handleLike = async (commentId) => {
    try {
      await axiosInstance.patch(`/comments/${commentId}/like`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchComments();
    } catch (err) {
      console.error('Like edilmədi:', err);
    }
  };

  const handleDelete = async (commentId) => {
    try {
      await axiosInstance.delete(`/comments/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchComments();
    } catch (err) {
      console.error('Silinmədi:', err);
    }
  };

  useEffect(() => {
    if (recipeId) fetchComments();
  }, [recipeId]);

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h3>Şərhlər</h3>
          <button onClick={onClose}>✖</button>
        </div>

        <div className={styles.commentList}>
          {comments.map((c) => (
            <div key={c._id} className={styles.commentItem}>
              <div className={styles.commentContent}>
                <span className={styles.name}>{c.user?.name || 'İstifadəçi'}</span>
                <p className={styles.text}>{c.content}</p>
                <div className={styles.actions}>
                  <button onClick={() => handleLike(c._id)}>❤️ {c.likes.length}</button>
                  <button onClick={() => setReplyTo(c._id)}>💬 Cavab ver</button>
                  {c.user && user && c.user._id.toString() === user._id.toString() && (
                    <button onClick={() => handleDelete(c._id)} className={styles.deleteBtn}>🗑️</button>
                  )}
                </div>

                {c.replies?.length > 0 && (
                  <div className={styles.replies}>
                    {c.replies.map((r) => (
                      <div key={r._id} className={styles.replyItem}>
                        <strong>{r.user?.name || 'İstifadəçi'}:</strong> {r.content}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className={styles.inputSection}>
          <input
            type="text"
            placeholder={replyTo ? 'Cavab yazın...' : 'Şərh yazın...'}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className={styles.input}
          />
          <button onClick={handleAddComment} className={styles.submitBtn}>Göndər</button>
        </div>
      </div>
    </div>
  );
};

export default CommentModal;
