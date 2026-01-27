import { useEffect, useState } from "react";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import AuthPanel from "../components/AuthPanel.jsx";
import Toast from "../components/Toast.jsx";
import AppRoutes from "./Route.jsx";
import AdminNavbar from "../admin/components/AdminNavbar";
import { authGuard } from "../utils/authGuard";
import { useAuth } from "../hooks/useAuth.js";

export default function Connect() {
  const { auth, loading } = useAuth() || null; //if auth is not found it return null
  const [toast, setToast] = useState("");
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));

  // Toast helper
  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  };

     useEffect(() => {
      (async () => {
        const message = await authGuard();

        if (message) {
          showToast(message);
          window.location.href = "/";
        }
      })();
    }, []);

  // Sync logout across tabs + clear cart/wishlist/orders
  useEffect(() => {
    const syncLogout = () => {
      const storedUser = JSON.parse(localStorage.getItem("auth")
);
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

  return (
    <>
      {/* AUTH POPUP */}
      <AuthPanel showToast={showToast} />

      {auth?.role === "admin" && <AdminNavbar />}
      {auth?.role !== "admin" && <Navbar />}

      <AppRoutes showToast={showToast} />

      <Footer />
      <Toast message={toast} />
    </>
  );
}
