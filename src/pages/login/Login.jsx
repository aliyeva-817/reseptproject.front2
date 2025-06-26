import { useState, useContext } from 'react';
import axiosInstance from '../../services/axiosInstance';
import { useNavigate, Link } from 'react-router-dom';
import styles from './Login.module.css';
import { AuthContext } from '../../context/AuthContext';
import { toast } from 'react-toastify';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { setAuth } = useContext(AuthContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.post('/auth/login', { email, password });

      localStorage.setItem('accessToken', res.data.tokens.accessToken);
      localStorage.setItem('refreshToken', res.data.tokens.refreshToken);
      localStorage.setItem('isRegistered', "true");
      localStorage.setItem('userId', res.data.user._id);

      // Login sonrası intro video üçün flag
      sessionStorage.setItem('justLoggedIn', 'true');

      setAuth({
        isLoggedIn: true,
        isAdmin: res.data.user.isAdmin || false,
        loading: false,
        user: res.data.user,
      });

      toast.success('✅ Giriş uğurludur!');
      navigate('/home');
    } catch (err) {
      const message = err.response?.data?.message;

      if (err.response?.status === 403) {
        toast.warning('⚠️ OTP təsdiqlənməyib. Emailinizi yoxlayın.');
      } else if (message === 'Email tapılmadı.') {
        toast.error('❌ Siz qeydiyyatdan keçməmisiniz.');
      } else if (
        message === 'Bu email artıq istifadə olunub' ||
        message === 'Bu istifadəçi adı artıq istifadə olunub' ||
        message === 'Bu istifadəçi adı artıq mövcuddur'
      ) {
        toast.error('⚠️ Bu ad və ya email artıq istifadə olunub.');
      } else if (message === 'Şifrə yanlışdır.') {
        toast.error('❌ Şifrə yanlışdır.');
      } else {
        toast.error(message || '❌ Giriş zamanı xəta baş verdi.');
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
