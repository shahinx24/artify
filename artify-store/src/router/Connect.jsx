import { Routes, Route } from "react-router-dom";
import HomePage from "../pages/HomePage.jsx";
import ProductsPage from "../pages/ProductsPage.jsx";
import CartPage from "../pages/CartPage.jsx";
import WishlistPage from "../pages/WishlistPage.jsx";
import NotFound from "../pages/NotFound.jsx";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import PaymentPage from "../pages/PaymentPage.jsx";
import OrdersPage from "../pages/OrdersPage.jsx";
import AuthPanel from "../components/AuthPanel.jsx";
import Toast from "../components/Toast.jsx";
import { useEffect, useState } from "react";

export default function Connect() {
  const [authMode, setAuthMode] = useState(null);
  const [toast, setToast] = useState("");
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));

  useEffect(() => {
  const syncLogout = () => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    
    // Update user
    setUser(storedUser);

    // If user logged out in another tab
    if (!storedUser) {
      // Clear cached data in current tab too
      localStorage.removeItem("cart");
      localStorage.removeItem("wishlist");
      localStorage.removeItem("orders");

      // OPTIONAL: redirect to homepage
      window.location.href = "/";
    }
  };

  window.addEventListener("storage", syncLogout);
  return () => window.removeEventListener("storage", syncLogout);
}, []);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  };

  return (
    <>
      {authMode && (
        <>
          <div className="auth-overlay" onClick={() => setAuthMode(null)}></div>
          <span className="auth-close" onClick={() => setAuthMode(null)}>✖</span>
          <AuthPanel
            authMode={authMode}
            setAuthMode={setAuthMode}
            showToast={showToast}
          />
        </>
      )}

      <Navbar setAuthMode={setAuthMode} showToast={showToast} />

      <Routes>
        <Route path="/" element={
          <HomePage setAuthMode={setAuthMode} showToast={showToast} />
        }/>
        <Route path="/products/:category" element={<ProductsPage showToast={showToast} />} />
        <Route path="/wishlist" element={<WishlistPage showToast={showToast} />} />
        <Route path="/cart" element={<CartPage showToast={showToast} />} />
        <Route path="/checkout" element={<PaymentPage showToast={showToast} />} />
        <Route path="/orders" element={<OrdersPage showToast={showToast} />} />
        <Route path="*" element={<NotFound />} />
      </Routes>

      <Footer />
      <Toast message={toast} />
    </>
  );
}