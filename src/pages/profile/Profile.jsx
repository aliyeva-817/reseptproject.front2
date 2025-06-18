import { useEffect, useState } from 'react';
import axiosInstance from '../../services/axiosInstance';
import { useNavigate } from 'react-router-dom';
import styles from './Profile.module.css';

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

  if (!user) return <p>Yüklənir...</p>;

  return (
    <div className={styles.profile}>
      <h2>Profil Məlumatları</h2>
      {user.profileImage && (
        <img src={`http://localhost:5000/${user.profileImage}`} alt="Profil" />
      )}
      <p><strong>Ad:</strong> {user.name}</p>
      <p><strong>İstifadəçi adı:</strong> {user.username}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Doğum tarixi:</strong> {user.birthday}</p>
      <p><strong>Cins:</strong> {user.gender}</p>
      <p><strong>Stil seçimi:</strong> {user.stylePreference}</p>
      {user.profileEmoji && <p><strong>Emoji:</strong> {user.profileEmoji}</p>}
      {user.profileColor && (
        <p><strong>Rəng:</strong> <span style={{ backgroundColor: user.profileColor }}>{user.profileColor}</span></p>
      )}
    </div>
  );
}

export default Profile;
