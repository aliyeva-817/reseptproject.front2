// src/pages/admin/Comments.jsx
import { useEffect, useState } from 'react';
import axiosInstance from '../../services/axiosInstance';

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
    if (!window.confirm("Bu şərhi silmək istədiyinizə əminsiniz?")) return;
    try {
      await axiosInstance.delete(`/admin/comments/${id}`);
      fetchComments();
    } catch (err) {
      alert("Şərh silinmədi");
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  return (
    <div>
      <h2>Şərhlər</h2>
      <ul>
        {comments.map((c) => (
          <li key={c._id}>
            <strong>{c.user?.username}</strong>: {c.content}
            <button onClick={() => handleDelete(c._id)}>Sil</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Comments;
