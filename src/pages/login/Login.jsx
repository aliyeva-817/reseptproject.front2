// ... mövcud importlar
import { useState, useContext } from 'react';
import axiosInstance from '../../services/axiosInstance';
import { useNavigate, Link } from 'react-router-dom';
import styles from './Login.module.css';
import { AuthContext } from '../../context/AuthContext';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { setAuth } = useContext(AuthContext);  // buraya əlavə et

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.post('/auth/login', { email, password });

      localStorage.setItem('accessToken', res.data.tokens.accessToken);
      localStorage.setItem('refreshToken', res.data.tokens.refreshToken);
      localStorage.setItem('isRegistered', "true");
      localStorage.setItem('userId', res.data.user._id);

      // ✅ Bu sətri əlavə et: login sonrası intro göstərilsin
      sessionStorage.setItem('justLoggedIn', 'true');

      setAuth({
        isLoggedIn: true,
        isAdmin: res.data.user.isAdmin || false,
        loading: false,
        user: res.data.user,
      });

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

      <p style={{ marginTop: '10px' }}>
        Qeydiyyatdan keçməmisiniz? <Link to="/register">Qeydiyyat</Link>
      </p>
    </div>
  );
}

export default Login;
