import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Register from "../pages/register/Register";
import Login from "../pages/login/Login";
import Home from "../pages/home/Home";
import AddRecipe from "../pages/add/AddRecipe";
import RecipeDetail from "../pages/recipe/RecipeDetail";
import Favorites from "../pages/favorites/Favorites";
import Layout from "../components/layout/Layout";
import Chat from "../pages/chat/ChatPage";
import Profile from "../pages/profile/Profile";
import CategoryPage from "../pages/category/CategoryPage";
import Premium from "../pages/premium/Premium";
import PremiumDetail from "../pages/premium/PremiumDetail";
import PaymentSuccess from "../pages/payment/PaymentSuccess";
import PaymentCancel from "../pages/payment/PaymentCancel";

const Router = () => {
  const isLoggedIn = !!localStorage.getItem("accessToken");

  return (
    <BrowserRouter>
      <Routes>
        {/* İlk girişdə yönləndirmə */}
        <Route
          path="/"
          element={
            isLoggedIn ? <Navigate to="/home" replace /> : <Register />
          }
        />

        {/* Açıq səhifələr */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/category/:categoryName" element={<CategoryPage />} />
        <Route path="/premium" element={<Premium />} />

        {/* Layout ilə açıq səhifələr (Header görünür) */}
        <Route element={<Layout />}>
          <Route path="/premium/:id" element={<PremiumDetail />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/payment-cancel" element={<PaymentCancel />} />
        </Route>

        {/* Login olmuş istifadəçilər üçün Layout daxilindəki qorunan səhifələr */}
        {isLoggedIn ? (
          <Route element={<Layout />}>
            <Route path="/home" element={<Home />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/add" element={<AddRecipe />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/recipe/:id" element={<RecipeDetail />} />
          </Route>
        ) : (
          // Login olunmayıbsa qorunanlara daxil olmaq olmaz
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
