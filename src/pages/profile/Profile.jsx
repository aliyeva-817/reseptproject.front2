import { useEffect, useState } from 'react';
import axiosInstance from '../../services/axiosInstance';
import { useNavigate } from 'react-router-dom';
import styles from './Profile.module.css';
import GreenLoader from '../../components/common/GreenLoader';

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
        navigate('/register'); // refreshsiz qeydiyyata yönləndir
      }
    };

    fetchUser();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("isRegistered");
    window.location.replace("/register"); // ✅ Tam yönləndirmə (refreshsiz loginə düşməmək üçün)
  };

  if (!user) return <GreenLoader />;

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
          style={{   color: '#666666',           // Yaşıl tonda rəng (və ya istədiyin rəng)
    cursor: 'pointer',
    textDecoration: 'underline',
    fontWeight: '900',
    transition: 'color 0.3s ease',}}
          onClick={() => navigate('/reset-password')}
        >
          Şifrəni sıfırla
        </span>
      </p>

      <button className={styles.logoutBtn} onClick={handleLogout}>
        Çıxış et
      </button>
    </div>
  );
}

export default Profile;
