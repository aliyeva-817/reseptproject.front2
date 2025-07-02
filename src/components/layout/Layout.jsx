import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import Header from "./header/Header";
import axiosInstance from "../../services/axiosInstance";
import { useDispatch } from "react-redux";
import { setUser } from "../../redux/reducers/userSlice";


import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Layout = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axiosInstance.get("/auth/profile");
        dispatch(setUser(res.data));
      } catch (err) {
        console.log("Profil məlumatı alınmadı:", err);
      }
    };

    fetchProfile();
  }, []);

  return (
    <>
      <Header />
      <main style={{ padding: "20px" }}>
        <Outlet />
      </main>
      {/* ToastContainer burada */}
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

export default Layout;
