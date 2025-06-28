import { useState, useContext } from 'react';
import axiosInstance from '../../services/axiosInstance';
import { useNavigate, Link } from 'react-router-dom';
import styles from './Login.module.css';
import { AuthContext } from '../../context/AuthContext';
import { toast } from 'react-toastify';

// ✅ Floating food images
import food1 from '../../assets/food/food1.png';
import food2 from '../../assets/food/food2.png';
import food3 from '../../assets/food/food3.png';
import food4 from '../../assets/food/food4.png';
import bgImage from '../../assets/food/arxa fon2.webp';

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
    <div
      className={styles.pageBackground}
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className={styles.overlay}>
        <div className={styles.container}>
          {/* Animated Food Images */}
          <img src={food1} className={`${styles.foodImage} ${styles.img1}`} alt="food1" />
          <img src={food2} className={`${styles.foodImage} ${styles.img2}`} alt="food2" />
          <img src={food3} className={`${styles.foodImage} ${styles.img3}`} alt="food3" />
          <img src={food4} className={`${styles.foodImage} ${styles.img4}`} alt="food4" />

          <h2 className={styles.title}>Giriş</h2>
          <form onSubmit={handleLogin} className={styles.form}>
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

          <p style={{
  marginTop: '33px',
  marginRight: '6px',
  color: '#1f1f1f',        // daha təmiz qara ton
  fontSize: '15.5px',
  textAlign: 'center',
}}>
  Qeydiyyatdan keçməmisiniz?{' '}
  <Link to="/register" style={{
    color: '#3d6b4f',       // daha tünd yaşıl
    fontWeight: '600',
    textDecoration: 'none'  // altındakı xətt silinsin
  }}>
    Qeydiyyat
  </Link>
</p>

        </div>
      </div>
    </div>
  );
}

export default Login;