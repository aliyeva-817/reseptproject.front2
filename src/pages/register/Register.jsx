import { useState } from 'react';
import axiosInstance from '../../services/axiosInstance';
import { useNavigate } from 'react-router-dom';
import styles from './Register.module.css';
import { useSnackbar } from 'notistack';

// ✅ Floating food images
import food1 from '../../assets/food/food1.png';
import food2 from '../../assets/food/food2.png';
import food3 from '../../assets/food/food3.png';
import food4 from '../../assets/food/food4.png';
import bgImage from '../../assets/food/arxa fon2.webp';

const Register = () => {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [otpStep, setOtpStep] = useState(false);
  const [otp, setOtp] = useState('');
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.post('/auth/register', form);
      setUserId(res.data.userId);
      setOtpStep(true);
      enqueueSnackbar("✅ OTP emailə göndərildi.", { variant: 'success' });
    } catch (err) {
      const msg = err.response?.data?.message;

      if (msg && msg.includes('istifadəçi adı')) {
        enqueueSnackbar("❌ Bu istifadəçi adı artıq istifadə olunub.", { variant: 'error' });
      } else if (msg && msg.includes('email')) {
        enqueueSnackbar("❌ Bu email artıq istifadə olunub.", { variant: 'error' });
      } else if (msg && msg.includes('OTP emailə göndərildi')) {
        enqueueSnackbar("✅ OTP yenidən göndərildi.", { variant: 'success' });
      } else {
        enqueueSnackbar(msg || '❌ Qeydiyyat zamanı xəta baş verdi.', { variant: 'error' });
      }
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post('/auth/verify-otp', { userId, otp });
      localStorage.setItem('isRegistered', "true");
      enqueueSnackbar('✅ OTP təsdiqləndi. İndi daxil ola bilərsiniz.', { variant: 'success' });
      navigate('/login');
    } catch (err) {
      enqueueSnackbar(err.response?.data?.message || '❌ OTP təsdiqləmə xətası', { variant: 'error' });
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

          <h2 className={styles.title}>Qeydiyyat</h2>
          {!otpStep ? (
            <form onSubmit={handleSubmit} className={styles.form}>
              <input name="username" placeholder="İstifadəçi adı" onChange={handleChange} required />
              <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
              <input name="password" type="password" placeholder="Şifrə" onChange={handleChange} required />
              <button type="submit">OTP Al</button>
            </form>
          ) : (
            <form onSubmit={handleOtpSubmit} className={styles.form}>
              <h4 className={styles.otpText}>Emailə gələn OTP-ni daxil edin:</h4>
              <input
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="OTP"
                required
              />
              <button type="submit">Təsdiqlə</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Register;