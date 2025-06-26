import { useState } from 'react';
import axiosInstance from '../../services/axiosInstance';
import { useNavigate } from 'react-router-dom';
import styles from './Register.module.css';
import { useSnackbar } from 'notistack'; // ✅ Notistack

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
  const { enqueueSnackbar } = useSnackbar(); // ✅

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
    <div className={styles.register}>
      {!otpStep ? (
        <form onSubmit={handleSubmit} className={styles.form}>
          <input name="username" placeholder="İstifadəçi adı" onChange={handleChange} required />
          <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
          <input name="password" type="password" placeholder="Şifrə" onChange={handleChange} required />
          <button type="submit">OTP Al</button>
        </form>
      ) : (
        <form onSubmit={handleOtpSubmit} className={styles.form}>
          <h4>Emailə gələn OTP-ni daxil edin:</h4>
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
  );
};

export default Register;
