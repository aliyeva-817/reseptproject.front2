import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../../src/context/AuthContext";
import { ThemeContext } from "../../theme/ThemeContext";
import styles from './Header.module.css';
import { io } from "socket.io-client";
import DarkModeToggle from "../../theme/DarkModeToggle"; // ✅ toggle

const SOCKET_SERVER_URL = 'http://localhost:5000';

const Header = () => {
  const { auth } = useContext(AuthContext);
  const { darkMode } = useContext(ThemeContext); // ✅ darkMode
  const isLoggedIn = auth.isLoggedIn;
  const userId = localStorage.getItem("userId");
  const [unreadTotal, setUnreadTotal] = useState(0);
  const socket = useState(() => io(SOCKET_SERVER_URL))[0];

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

  return (
    <header className={`${styles.header} ${darkMode ? styles.dark : ''}`}>
      <h1 className={styles.title}>Reseptmatik</h1>
      <nav className={styles.nav}>
        <Link to="/home" className={styles.link}>Əsas</Link>
        {isLoggedIn ? (
          <>
            <Link to="/favorites" className={styles.link}>Favorilər</Link>
            <Link to="/add" className={styles.link}>Resept əlavə et</Link>
            <Link to="/chat" className={styles.link}>
              <span className={styles.chatWrapper}>
                Chat
                {unreadTotal > 0 && (
                  <span className={styles.notificationDot}>{unreadTotal}</span>
                )}
              </span>
            </Link>
            <Link to="/my-recipes" className={styles.link}>Mənim Reseptlərim</Link>
            <Link to="/meal-planner" className={styles.link}>Planlayıcı</Link>
            <Link to="/premium" className={styles.link}>Premium Reseptlər</Link>
            <Link to="/profile" className={styles.link}>Profil</Link>
          </>
        ) : (
          <>
            <Link to="/login" className={styles.link}>Giriş</Link>
            <Link to="/register" className={styles.link}>Qeydiyyat</Link>
          </>
        )}
        <DarkModeToggle />
      </nav>
    </header>
  );
};

export default Header;
