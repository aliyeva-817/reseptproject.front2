import React, { createContext, useState, useEffect } from "react";
import axiosInstance from "../services/axiosInstance";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    isLoggedIn: false,
    isAdmin: false,
    loading: true,
    user: null,
  });

  const fetchProfile = async () => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      setAuth({
        isLoggedIn: false,
        isAdmin: false,
        loading: false,
        user: null,
      });
      return;
    }

    try {
      const res = await axiosInstance.get("/auth/profile");
      setAuth({
        isLoggedIn: true,
        isAdmin: res.data.isAdmin || false,
        loading: false,
        user: res.data,
      });
    } catch (err) {
      localStorage.removeItem("accessToken");
      setAuth({
        isLoggedIn: false,
        isAdmin: false,
        loading: false,
        user: null,
      });
    }
  };

  useEffect(() => {
    setAuth((prev) => ({ ...prev, loading: true }));
    fetchProfile();
  }, []);

const logout = async () => {
  try {
    // await axiosInstance.post("/auth/logout");
  } catch (err) {
    // console.error(err);
  } finally {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("isAdmin");

    setAuth({
      isLoggedIn: false,
      isAdmin: false,
      loading: false,
      user: null,
    });

    // ✅ Redirect to Home, not Login or Register
    window.location.href = "/home";
  }
};


  return (
    <AuthContext.Provider value={{ auth, setAuth, logout, fetchProfile }}>
      {children}
    </AuthContext.Provider>
  );
};
