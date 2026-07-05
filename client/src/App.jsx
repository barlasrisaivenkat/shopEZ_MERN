import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Header from './components/Header';
import Footer from './components/Footer';

import HomePage from './pages/HomePage';
import ProductDetailPage from './pages/ProductDetailPage';
import AuthPage from './pages/AuthPage';
import CartPage from './pages/CartPage';
import WishlistPage from './pages/WishlistPage';
import OrdersPage from './pages/OrdersPage';
import ProfilePage from './pages/ProfilePage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import SellerDashboardPage from './pages/SellerDashboardPage';
import ProductManagementPage from './pages/ProductManagementPage';

import {
  authApi,
  cartApi,
  wishlistApi,
  setAuthToken
} from './services/api';

import './App.css';

function App() {

  const [user, setUser] = useState(null);

  const [cartCount, setCartCount] = useState(0);

  const [wishlistCount, setWishlistCount] = useState(0);

  // Global Search
  const [searchKeyword, setSearchKeyword] = useState("");

  const loadUser = async () => {

    const token = localStorage.getItem("shopEZ-token");

    if (!token) return;

    try {

      const response = await authApi.getProfile();

      setUser(response.data?.data || response.data?.user || null);

    } catch {

      setAuthToken(null);

      setUser(null);

    }

  };

  const refreshCounts = async () => {

    if (!user) {

      setCartCount(0);

      setWishlistCount(0);

      return;

    }

    try {

      const [cartRes, wishlistRes] = await Promise.all([
        cartApi.get(),
        wishlistApi.get()
      ]);

      setCartCount(cartRes.data?.data?.items?.length || 0);

      setWishlistCount(
        wishlistRes.data?.data?.products?.length || 0
      );

    } catch (err) {

      console.error(err);

    }

  };

  useEffect(() => {

    loadUser();

  }, []);

  useEffect(() => {

    refreshCounts();

  }, [user]);

  const handleAuth = (authUser) => {

    setUser(authUser);

  };

  const handleLogout = () => {

    setAuthToken(null);

    setUser(null);

  };

  return (

    <Router>

      <Header
        user={user}
        onLogout={handleLogout}
        cartCount={cartCount}
        wishlistCount={wishlistCount}
        searchKeyword={searchKeyword}
        setSearchKeyword={setSearchKeyword}
      />

      <Routes>

        <Route
          path="/"
          element={
            <HomePage
              user={user}
              searchKeyword={searchKeyword}
              onCartUpdated={refreshCounts}
              onWishlistUpdated={refreshCounts}
            />
          }
        />

        <Route
          path="/product/:id"
          element={
            <ProductDetailPage
              user={user}
              onCartUpdated={refreshCounts}
              onWishlistUpdated={refreshCounts}
            />
          }
        />

        <Route
          path="/login"
          element={
            user
              ? <Navigate to="/" />
              : <AuthPage onAuth={handleAuth} />
          }
        />

        <Route
          path="/cart"
          element={
            user
              ? <CartPage user={user} onCartUpdated={refreshCounts} />
              : <Navigate to="/login" />
          }
        />

        <Route
          path="/wishlist"
          element={
            user
              ? <WishlistPage onCartUpdated={refreshCounts} />
              : <Navigate to="/login" />
          }
        />

        <Route
          path="/orders"
          element={
            user
              ? <OrdersPage />
              : <Navigate to="/login" />
          }
        />

        <Route
          path="/profile"
          element={
            user
              ? <ProfilePage />
              : <Navigate to="/login" />
          }
        />

        <Route
          path="/admin"
          element={
            user && user.role === "admin"
              ? <AdminDashboardPage />
              : <Navigate to="/login" />
          }
        />

        <Route
          path="/seller"
          element={
            user && user.role === "seller"
              ? <SellerDashboardPage user={user} />
              : <Navigate to="/login" />
          }
        />

        <Route
          path="/manage-products"
          element={
            user &&
            (user.role === "admin" || user.role === "seller")
              ? <ProductManagementPage user={user} />
              : <Navigate to="/login" />
          }
        />

      </Routes>

      <Footer />

    </Router>

  );

}

export default App;