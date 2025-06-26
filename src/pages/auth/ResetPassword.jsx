import React, { useState } from 'react';
import axios from '../../services/axiosInstance';
import styles from './ResetPassword.module.css';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';

const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/auth/send-reset-otp', { email });
      setOtpSent(true);
      toast.success('✅ OTP emailə göndərildi');
    } catch (err) {
      toast.error(err.response?.data?.message || 'OTP göndərilmədi');
    }
  };

 const handleResetPassword = async (e) => {
  e.preventDefault();
  try {
    await axios.post('/auth/reset-password', { email, otp, newPassword });
    toast.success("✅ Şifrə yeniləndi. Yönləndirilirsiniz...");

    // 1 saniyə sonra yönləndir və formu təmizləmə
    setTimeout(() => {
      navigate("/login");
    }, 1000); // daha qısa göstəririk

  } catch (err) {
    toast.error(err.response?.data?.message || 'Şifrə yenilənmədi');
  }
};


  return (
    <div className={styles.container}>
      <h2>Şifrəni Bərpa Et</h2>
      <form onSubmit={otpSent ? handleResetPassword : handleSendOtp}>
        <input
          type="email"
          placeholder="Email daxil edin"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        {otpSent && (
          <>
            <input
              type="text"
              placeholder="OTP kodu"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Yeni şifrə"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </>
        )}
        <button type="submit">
          {otpSent ? 'Şifrəni Yenilə' : 'OTP Göndər'}
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
