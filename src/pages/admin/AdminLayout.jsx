import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import styles from "./AdminLayout.module.css";

const AdminLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("isAdmin");
    navigate("/home"); // və ya "/login" ə yönləndirə bilərsən
  };

  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        <h2>Admin Panel</h2>
        <nav>
          <NavLink to="/admin" end>Dashboard</NavLink>
          <NavLink to="/admin/users">Users</NavLink>
          <NavLink to="/admin/recipes">Recipes</NavLink>
          <NavLink to="/admin/comments">Comments</NavLink>
          <NavLink to="/admin/categories">Categories</NavLink>
          <NavLink to="/admin/payments">Payments</NavLink>
          <NavLink to="/admin/notifications">Notifications</NavLink>

          {/* ✅ Burada dəyişiklik etdik */}
          <button onClick={handleLogout} className={styles.logoutBtn}>
            Logout
          </button>
        </nav>
      </aside>

      <div className={styles.content}>
        <header className={styles.header}>Admin Dashboard</header>
        <main className={styles.main}>
          <Outlet />
        </main>
        <footer className={styles.footer}>
          &copy; {new Date().getFullYear()} Admin Panel – All rights reserved
        </footer>
      </div>
    </div>
  );
};

export default AdminLayout;
