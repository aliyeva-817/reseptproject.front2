import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../../../src/context/AuthContext";
import styles from './Header.module.css';

const Header = () => {
  const { auth, logout } = useContext(AuthContext);
  const isLoggedIn = auth.isLoggedIn;

  const handleLogout = () => {
    logout();
    window.location.href = "/login"; // ✅ səhifə tam yenilənir, auth sıfırlanır
  };

  return (
    <header className={styles.header}>
      <h1 className={styles.title}>Virtual Closet</h1>
      <nav className={styles.nav}>
        <Link to="/home" className={styles.link}>Əsas</Link>
        {isLoggedIn ? (
          <>
            <Link to="/favorites" className={styles.link}>Favorilər</Link>
            <Link to="/add" className={styles.link}>Resept əlavə et</Link>
            <Link to="/chat" className={styles.link}>Chat</Link>
            <Link to="/my-recipes">Mənim Reseptlərim</Link>
            <Link to="/meal-planner">Planlayıcı</Link>
            <Link to="/premium" className={styles.link}>Premium Reseptlər</Link>
            <Link to="/profile" className={styles.link}>Profil</Link>
            <button onClick={handleLogout} className={styles.button}>Çıxış</button>
          </>
        ) : (
          <>
            <Link to="/login" className={styles.link}>Giriş</Link>
            <Link to="/register" className={styles.link}>Qeydiyyat</Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
