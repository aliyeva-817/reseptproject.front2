import { useEffect, useState } from 'react';
import axiosInstance from '../../services/axiosInstance';
import { useNavigate } from 'react-router-dom';
import styles from './Profile.module.css';
import GreenLoader from '../../components/common/GreenLoader'; // ✅ Loader import

function Profile() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axiosInstance.get('/auth/profile');
        setUser(res.data);
      } catch (err) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("isRegistered");
        navigate('/login');
      }
    };

    fetchUser();
  }, [navigate]);

  if (!user) return <GreenLoader />; // ✅ Loader əlavə olundu

  return (
    <div className={styles.profile}>
      <h2>Profil Məlumatları</h2>
      {user.profileImage && (
        <img src={`http://localhost:5000/${user.profileImage}`} alt="Profil" />
      )}
      <p><strong>İstifadəçi adı:</strong> {user.username}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p>
        <strong>Şifrəni unutmusuz?</strong>{' '}
        <span
          style={{ color: 'blue', cursor: 'pointer', textDecoration: 'underline' }}
          onClick={() => navigate('/reset-password')}
        >
          Şifrəni sıfırla
        </span>
      </p>
    </div>
  );
}

export default Profile;
