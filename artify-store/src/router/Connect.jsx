import { useEffect, useState } from "react";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import AuthPanel from "../components/AuthPanel.jsx";
import Toast from "../components/Toast.jsx";
import AppRoutes from "./Route.jsx";

export default function Connect() {
  const [authMode, setAuthMode] = useState(null);
  const [toast, setToast] = useState("");
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));

  // Sync logout across tabs + clear cart/wishlist/orders
  useEffect(() => {
    const syncLogout = () => {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      setUser(storedUser);

      if (!storedUser) {
        localStorage.removeItem("cart");
        localStorage.removeItem("wishlist");
        localStorage.removeItem("orders");
        window.location.href = "/";
      }
    };

    window.addEventListener("storage", syncLogout);
    return () => window.removeEventListener("storage", syncLogout);
  }, []);

  // Toast helper
  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  };

  return (
    <>
      {/* AUTH POPUP */}
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

      {/* NAVIGATION */}
      <Navbar setAuthMode={setAuthMode} showToast={showToast} />

      {/* ROUTES MOVED TO SEPARATE FILE */}
      <AppRoutes 
        user={user} 
        setAuthMode={setAuthMode}
        showToast={showToast} 
      />

      <Footer />
      <Toast message={toast} />
    </>
  );
}
