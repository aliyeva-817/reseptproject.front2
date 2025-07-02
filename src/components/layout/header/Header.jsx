import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../../src/context/AuthContext";
import { ThemeContext } from "../../theme/ThemeContext";
import styles from './Header.module.css';
import { io } from "socket.io-client";
import DarkModeToggle from "../../theme/DarkModeToggle";
import logo from '../../../assets/food/logo.png';
import { CiMenuBurger } from "react-icons/ci";

const SOCKET_SERVER_URL = 'http://localhost:5000';

const Header = () => {
  const { auth } = useContext(AuthContext);
  const { darkMode } = useContext(ThemeContext);
  const isLoggedIn = auth.isLoggedIn;
  const userId = localStorage.getItem("userId");
  const [unreadTotal, setUnreadTotal] = useState(0);
  const socket = useState(() => io(SOCKET_SERVER_URL))[0];
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!userId) return;
    socket.emit("addUser", userId);
    socket.on("getMessage", (msg) => {
      const chatRecipient = localStorage.getItem("chatRecipient");
      const isCurrentChat = chatRecipient && JSON.parse(chatRecipient)._id === msg.senderId;
      if (!isCurrentChat) {
        setUnreadTotal((prev) => prev + 1);
      }
    });
    return () => {
      socket.disconnect();
    };
  }, [userId]);

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  return (
    <header className={`${styles.header} ${darkMode ? styles.dark : styles.light}`}>
      <div className={styles.nav1}>
        <div className={styles.left}>
          <img src={logo} alt="logo" className={styles.logo} />
          <h1 className={styles.title}>RESEPTMATIK</h1>
        </div>

        <nav className={`${styles.nav} ${menuOpen ? styles.open : ''}`}>
          <Link to="/home" className={styles.link}>Əsas</Link>
          {isLoggedIn && (
            <>
              <Link to="/favorites" className={styles.link}>Favorilər</Link>
              <Link to="/add" className={styles.link}>Resept əlavə et</Link>
              <Link to="/my-recipes" className={styles.link}>Mənim Reseptlərim</Link>
              <Link to="/meal-planner" className={styles.link}>Planlayıcı</Link>
              <Link to="/premium" className={styles.link}>Premium</Link>
            </>
          )}
          {!isLoggedIn && (
            <>
              <Link to="/login" className={styles.link}>Giriş</Link>
              <Link to="/register" className={styles.link}>Qeydiyyat</Link>
            </>
          )}
        </nav>

        <div className={styles.right}>
          {isLoggedIn && (
            <>
              <Link to="/chat" className={styles.iconWrapper}>
                <lord-icon
                  src="https://cdn.lordicon.com/uyxrgiem.json"
                  trigger="hover"
                  colors={
                    darkMode
                      ? "primary:#ffffff,secondary:#cccccc"
                      : "primary:#121331,secondary:#5a7b5b"
                  }
                  style={{ width: "32px", height: "32px" }}
                ></lord-icon>
                {unreadTotal > 0 && (
                  <span className={styles.notificationDot}>{unreadTotal}</span>
                )}
              </Link>

              <Link to="/profile" className={styles.iconWrapper}>
                <lord-icon
                  src="https://cdn.lordicon.com/kdduutaw.json"
                  trigger="hover"
                  colors={
                    darkMode
                      ? "primary:#ffffff,secondary:#cccccc"
                      : "primary:#121331,secondary:#2f5249"
                  }
                  style={{ width: "32px", height: "32px" }}
                ></lord-icon>
              </Link>
            </>
          )}

          <div className={styles.mode}>
            <DarkModeToggle />
          </div>

          <button type="button" className={styles.menuButton} onClick={toggleMenu}>
            <CiMenuBurger />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
