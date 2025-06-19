import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Register from "../pages/register/Register";
import Login from "../pages/login/Login";
import Home from "../pages/home/Home";
import AddRecipe from "../pages/add/AddRecipe";
import RecipeDetail from "../pages/recipe/RecipeDetail";
import Favorites from "../pages/favorites/Favorites";
import Layout from "../components/layout/Layout";
import Chat from "../pages/chat/ChatPage";           // Yeni əlavə
import Profile from "../pages/profile/Profile"; // Yeni əlavə

const Router = () => {
  const isLoggedIn = !!localStorage.getItem("accessToken");
  const isRegistered = localStorage.getItem("isRegistered") === "true";

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            isLoggedIn ? (
              <Navigate to="/home" replace />
            ) : isRegistered ? (
              <Navigate to="/login" replace />
            ) : (
              <Register />
            )
          }
        />

        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {isLoggedIn && (
          <Route element={<Layout />}>
            <Route path="/home" element={<Home />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/add" element={<AddRecipe />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/recipe/:id" element={<RecipeDetail />} />
          </Route>
        )}

        {!isLoggedIn && (
          <>
            <Route path="/home" element={<Navigate to="/" replace />} />
            <Route path="/chat" element={<Navigate to="/" replace />} />
            <Route path="/favorites" element={<Navigate to="/" replace />} />
            <Route path="/add" element={<Navigate to="/" replace />} />
            <Route path="/profile" element={<Navigate to="/" replace />} />
            <Route path="/recipe/:id" element={<Navigate to="/" replace />} />
          </>
        )}
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
