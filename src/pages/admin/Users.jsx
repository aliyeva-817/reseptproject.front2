// src/pages/admin/Users.jsx
import { useEffect, useState } from 'react';
import axiosInstance from '../../services/axiosInstance';

const Users = () => {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const res = await axiosInstance.get('/admin/users');
      setUsers(res.data);
    } catch (err) {
      console.error("İstifadəçilər yüklənmədi:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("İstifadəçi silinsin?")) return;
    try {
      await axiosInstance.delete(`/admin/users/${id}`);
      fetchUsers();
    } catch (err) {
      alert("Silinmə zamanı xəta baş verdi.");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div>
      <h2>İstifadəçilər</h2>
      <ul>
        {users.map((u) => (
          <li key={u._id}>
            {u.username} ({u.email}) — {new Date(u.createdAt).toLocaleDateString()}
            <button onClick={() => handleDelete(u._id)}>Sil</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Users;
