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

// 🆕 Stripe nəticə səhifələri
import PaymentSuccess from "../pages/payment/PaymentSuccess";
import PaymentCancel from "../pages/payment/PaymentCancel";

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
        <Route path="/category/:categoryName" element={<CategoryPage />} />
        <Route path="/premium" element={<Premium />} />
        <Route path="/premium/:id" element={<PremiumDetail />} />

        {isLoggedIn && (
          <Route element={<Layout />}>
            <Route path="/home" element={<Home />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/add" element={<AddRecipe />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/recipe/:id" element={<RecipeDetail />} />

            {/* 🆕 Stripe nəticə səhifələri Layout daxilində */}
            <Route path="/payment-success" element={<PaymentSuccess />} />
            <Route path="/payment-cancel" element={<PaymentCancel />} />
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
            {/* Premium detail də qorunsun */}
            <Route path="/payment-success" element={<Navigate to="/" replace />} />
            <Route path="/payment-cancel" element={<Navigate to="/" replace />} />
          </>
        )}
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
