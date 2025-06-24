import { useContext } from "react";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";

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

import AdminLogin from "../pages/admin/AdminLogin";
import AdminLayout from "../pages/admin/AdminLayout";
import AdminPanel from "../pages/admin/AdminPanel";
import Users from "../pages/admin/Users";
import Recipes from "../pages/admin/Recipes";
import Comments from "../pages/admin/Comments";
import Categories from "../pages/admin/Categories";
import Payments from "../pages/admin/Payments";
import Notifications from "../pages/admin/Notifications";

import { AuthContext } from "../context/AuthContext";

const Router = () => {
  const { auth } = useContext(AuthContext);
  const { isLoggedIn, isAdmin, loading } = auth;

  const PrivateRoute = () => {
    if (loading) return <p>Yüklənir...</p>;
    return isLoggedIn ? <Outlet /> : <Navigate to="/login" replace />;
  };

  const AdminRoute = () => {
    if (loading) return <p>Yüklənir...</p>;
    return isLoggedIn && isAdmin ? <Outlet /> : <Navigate to="/admin/login" replace />;
  };

  const PublicRoute = () => {
    if (loading) return <p>Yüklənir...</p>;
    if (isLoggedIn) {
      if (isAdmin) return <Navigate to="/admin" replace />;
      else return <Navigate to="/home" replace />;
    }
    return <Outlet />;
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PublicRoute />}>
          <Route index element={<Register />} />
          <Route path="register" element={<Register />} />
          <Route path="login" element={<Login />} />
        </Route>

        <Route element={<PrivateRoute />}>
          <Route element={<Layout />}>
            <Route path="home" element={<Home />} />
            <Route path="favorites" element={<Favorites />} />
            <Route path="add" element={<AddRecipe />} />
            <Route path="profile" element={<Profile />} />
            <Route path="chat" element={<Chat />} />
            <Route path="recipe/:id" element={<RecipeDetail />} />
            <Route path="category/:categoryName" element={<CategoryPage />} />
            <Route path="premium" element={<Premium />} />
            <Route path="premium/:id" element={<PremiumDetail />} />
            <Route path="payment-success" element={<PaymentSuccess />} />
            <Route path="payment-cancel" element={<PaymentCancel />} />
          </Route>
        </Route>

        <Route
          path="/admin/login"
          element={
            loading ? (
              <p>Yüklənir...</p>
            ) : isLoggedIn && isAdmin ? (
              <Navigate to="/admin" replace />
            ) : (
              <AdminLogin />
            )
          }
        />

        <Route path="/admin" element={<AdminRoute />}>
          <Route element={<AdminLayout />}>
            <Route index element={<AdminPanel />} />
            <Route path="users" element={<Users />} />
            <Route path="recipes" element={<Recipes />} />
            <Route path="comments" element={<Comments />} />
            <Route path="categories" element={<Categories />} />
            <Route path="payments" element={<Payments />} />
            <Route path="notifications" element={<Notifications />} />
          </Route>
        </Route>

        <Route
          path="*"
          element={
            loading ? (
              <p>Yüklənir...</p>
            ) : (
              <Navigate to={isLoggedIn ? (isAdmin ? "/admin" : "/home") : "/"} replace />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
