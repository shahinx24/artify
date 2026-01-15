import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import ProductsPage from "./pages/ProductsPage.jsx";
import CartPage from "./pages/CartPage.jsx";
import WishlistPage from "./pages/WishlistPage.jsx";
import NotFound from "./pages/NotFound.jsx";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import AuthPanel from "./components/AuthPanel.jsx";
import Toast from "./components/Toast";
import PaymentPage from "./pages/PaymentPage.jsx";

export default function App() {
  const [authMode, setAuthMode] = useState(null);
  const [toast, setToast] = useState("");

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
          <HomePage authMode={authMode} setAuthMode={setAuthMode} showToast={showToast} /> } 
        />
        <Route path="/products/:category" element={<ProductsPage showToast={showToast} />} />
        <Route path="/wishlist" element={<WishlistPage showToast={showToast} />}/>
        <Route path="/cart" element={<CartPage showToast={showToast} />} />
        <Route path="/checkout" element={<PaymentPage showToast={showToast} />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
      <Toast message={toast} />
    </>
  );
}