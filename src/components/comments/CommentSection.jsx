import React, { useEffect, useState } from 'react';
import axiosInstance from '../../services/axiosInstance';
import { useSelector } from 'react-redux';
import styles from './CommentSection.module.css';

const CommentSection = ({ recipeId }) => {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState('');
  const user = useSelector((state) => state.user.user);
  const token = localStorage.getItem('accessToken');

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
        { recipeId, content: text },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
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
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchComments();
    } catch (err) {
      console.error('Like edilmədi:', err);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [recipeId]);

  return (
    <div className={styles.commentSection}>
      <h3>Şərhlər</h3>

      {user && (
        <form onSubmit={handleSubmit} className={styles.commentForm}>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Şərhinizi yazın..."
            required
          />
          <button type="submit">Göndər</button>
        </form>
      )}

      <div className={styles.commentList}>
        {comments.map((comment) => (
          <div key={comment._id} className={styles.comment}>
            <p><strong>{comment.user?.name || 'Anonim'}:</strong> {comment.content}</p>
            <button onClick={() => toggleLike(comment._id)}>
              ❤️ {comment.likes.length}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentSection;
