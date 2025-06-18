import { useState } from 'react';
import axiosInstance from '../../services/axiosInstance';
import { useNavigate } from 'react-router-dom';
import styles from './Register.module.css';

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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.post('/auth/register', form);
      setUserId(res.data.userId);
      setOtpStep(true);
    } catch (err) {
      // İstifadəçi artıq mövcuddur alerti silindi, digər xətalar alert kimi qalır
      const msg = err.response?.data?.message;
      if (msg && msg.includes('artıq mövcuddur')) {
        // Heç nə göstərmir, sadəcə OTP mərhələsinə keçmək üçün istifadəçi ID varsa set et
        if (err.response.data.userId) {
          setUserId(err.response.data.userId);
          setOtpStep(true);
        }
        // Əgər userId yoxdursa, heç nə etmə
      } else {
        alert(msg || 'Qeydiyyat xətası');
      }
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post('/auth/verify-otp', { userId, otp });
      localStorage.setItem('isRegistered', "true");
      alert('OTP təsdiqləndi. İndi daxil ola bilərsiniz.');
      navigate('/login');
    } catch (err) {
      alert(err.response?.data?.message || 'OTP xətası');
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
