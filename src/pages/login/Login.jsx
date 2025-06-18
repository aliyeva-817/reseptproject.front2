import { useState } from 'react';
import axiosInstance from '../../services/axiosInstance';
import { useNavigate, Link } from 'react-router-dom';
import styles from './Login.module.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.post('/auth/login', { email, password });

      localStorage.setItem('accessToken', res.data.tokens.accessToken);
      localStorage.setItem('refreshToken', res.data.tokens.refreshToken);
      localStorage.setItem('isRegistered', "true");

      alert('Giriş uğurludur');
      navigate('/home');
    } catch (err) {
      if (err.response?.status === 403) {
        alert('OTP təsdiqlənməyib. Emailinizi yoxlayın.');
      } else if (err.response?.data?.message === 'Email tapılmadı.') {
        alert('Siz qeydiyyatdan keçməmisiniz.');
      } else {
        alert(err.response?.data?.message || 'Giriş xətası');
      }
    }
  };

  return (
    <div className={styles.login}>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Şifrə"
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Daxil ol</button>
      </form>

      {/* Qeydiyyat linki düzəldildi */}
      <p style={{ marginTop: '10px' }}>
        Qeydiyyatdan keçməmisiniz? <Link to="/register">Qeydiyyat</Link>
      </p>
    </div>
  );
}

export default Login;
