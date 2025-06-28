import React, { useEffect, useState } from 'react';
import axiosInstance from '../../services/axiosInstance';
import { useSelector } from 'react-redux';
import styles from './CommentSection.module.css';

const CommentSection = ({ recipeId }) => {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState('');
  const [replyText, setReplyText] = useState('');
  const [activeReplyId, setActiveReplyId] = useState(null);
  const user = useSelector((state) => state.user.user);
  const token = localStorage.getItem('accessToken');

  const getUserName = (user) => {
    return user?.name || user?.username || 'Anonim';
  };

  const fetchComments = async () => {
    try {
      const res = await axiosInstance.get(`/comments/${recipeId}`);
      setComments(res.data);
    } catch (err) {
      console.error('Şərhləri yükləmək olmadı:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post(
        '/comments',
        { recipeId, text },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setText('');
      fetchComments();
    } catch (err) {
      console.error('Şərh göndərilmədi:', err);
    }
  };

  const toggleLike = async (commentId) => {
    try {
      await axiosInstance.patch(`/comments/${commentId}/like`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchComments();
    } catch (err) {
      console.error('Like edilmədi:', err);
    }
  };

  const handleDelete = async (commentId) => {
    if (!window.confirm('Şərh silinsin?')) return;
    try {
      await axiosInstance.delete(`/comments/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchComments();
    } catch (err) {
      console.error('Şərh silinmədi:', err);
    }
  };

  const handleReplySubmit = async (e, commentId) => {
    e.preventDefault();
    try {
      await axiosInstance.post(
        `/comments/${commentId}/reply`,
        { text: replyText },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setReplyText('');
      setActiveReplyId(null);
      fetchComments();
    } catch (err) {
      console.error('Cavab göndərilmədi:', err);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [recipeId]);

  return (
    <div className={styles.commentSection}>
      <h3 className={styles.title}>Şərhlər</h3>

      {user ? (
        <form onSubmit={handleSubmit} className={styles.commentForm}>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Şərhinizi yazın..."
            className={styles.textarea}
            required
          />
          <button type="submit" className={styles.submitButton}>Göndər</button>
        </form>
      ) : (
        <p className={styles.loginNotice}>Şərh yazmaq üçün daxil olun</p>
      )}

      <div className={styles.commentList}>
        {comments.map((comment) => (
          <div key={comment._id} className={styles.commentCard}>
            <p className={styles.commentText}><strong className={styles.username}>{getUserName(comment.user)}:</strong> {comment.content}</p>

            <div className={styles.actionButtons}>
              <button className={styles.actionBtn} onClick={() => toggleLike(comment._id)}>❤️ {comment.likes.length}</button>
              <button className={styles.actionBtn} onClick={() => setActiveReplyId(comment._id)}>💬</button>
              {user?._id === comment.user?._id && (
                <button className={styles.actionBtn} onClick={() => handleDelete(comment._id)}>🗑️</button>
              )}
            </div>

            {activeReplyId === comment._id && (
              <form onSubmit={(e) => handleReplySubmit(e, comment._id)} className={styles.replyForm}>
                <input
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Cavabınızı yazın"
                  className={styles.replyInput}
                  required
                />
                <button type="submit" className={styles.replyButton}>Göndər</button>
              </form>
            )}

            {comment.replies?.length > 0 && (
              <div className={styles.replyList}>
                {comment.replies.map((reply, idx) => (
                  <div key={idx} className={styles.replyItem}>
                    <p>
                      <strong className={styles.username}>{getUserName(reply.user)}:</strong>
                      <span className={styles.replyContent}> ↳ {reply.content}</span>
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentSection;