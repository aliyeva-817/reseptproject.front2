import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("accessToken");

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("isRegistered");
    navigate("/login");
  };

  return (
    <header>
      <h1>Virtual Closet</h1>
      <nav>
        <Link to="/home">Əsas</Link>
        {isLoggedIn && (
          <>
            <Link to="/favorites">Favorilər</Link>
            <Link to="/add">Resept əlavə et</Link>
            <Link to="/chat">Chat</Link>
            <Link to="/profile">Profil</Link>
            <button onClick={handleLogout}>Çıxış</button>
          </>
        )}
        {!isLoggedIn && (
          <>
            <Link to="/login">Giriş</Link>
            <Link to="/register">Qeydiyyat</Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
