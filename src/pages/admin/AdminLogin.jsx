import { useState, useContext } from 'react';
import axiosInstance from '../../services/axiosInstance';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import styles from './AdminLogin.module.css';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { fetchProfile } = useContext(AuthContext); // ✅ auth yeniləmək üçün

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.post('/admin/login', { email, password });

      localStorage.setItem('accessToken', res.data.tokens.accessToken);
      localStorage.setItem('isAdmin', res.data.user.isAdmin.toString());

      await fetchProfile(); // ✅ auth context yenilənsin
      navigate('/admin');   // ✅ yalnız bundan sonra yönləndir
    } catch (err) {
      setError(err.response?.data?.message || 'Xəta baş verdi');
    }
  };

  return (
    <div className={styles.container}>
      <h2>Admin Giriş</h2>
      <form onSubmit={handleLogin} className={styles.form}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Şifrə"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p className={styles.error}>{error}</p>}
        <button type="submit">Giriş et</button>
      </form>
    </div>
  );
};

export default AdminLogin;
