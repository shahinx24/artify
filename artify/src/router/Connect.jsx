import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import Toast from "../components/Toast.jsx";
import AppRoutes from "./Route.jsx";
import AdminNavbar from "../admin/components/AdminNavbar";
import { authGuard } from "../utils/authGuard";
import { useAuth } from "../context/AuthContext.jsx";
import { useCallback, useEffect, useState } from "react";

export default function Connect() {
  const [toast, setToast] = useState("");
  const showToast = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  }, []);

  const authState = useAuth();
  const { auth, loading, logout } = authState;

  useEffect(() => {
    if (loading) return;

    (async () => {
      const message = await authGuard(auth);
      if (message) {
        showToast(message);
        logout();
      }
    })();
  }, [auth, loading, logout, showToast]);

  if (loading) return null;

  return (
    <div className="app-shell">
      {auth?.role === "admin" ? <AdminNavbar /> : <Navbar />}
      <AppRoutes auth={auth} showToast={showToast} />
      <Footer />
      {toast && <Toast message={toast} />}
    </div>
  );
}
