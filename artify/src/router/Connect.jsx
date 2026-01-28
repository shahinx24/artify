import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import AuthPanel from "../components/AuthPanel.jsx";
import Toast from "../components/Toast.jsx";
import AppRoutes from "./Route.jsx";
import AdminNavbar from "../admin/components/AdminNavbar";
import { authGuard } from "../utils/authGuard";
import { useAuth } from "../hooks/useAuth";
import { useEffect, useState } from "react";

export default function Connect() {
  const [toast, setToast] = useState("");
  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  };

  const { auth, loading, logout } = useAuth(showToast);
  const authState = useAuth(showToast);

  useEffect(() => {
    if (loading) return;

    (async () => {
      const message = await authGuard(auth);
      if (message) {
        showToast(message);
        logout();
      }
    })();
  }, [auth, loading]);

  if (loading) return null;

  return (
    <>
      {/* AUTH POPUP */}
      <AuthPanel authState={authState} showToast={showToast} />
      {auth?.role === "admin" ? <AdminNavbar /> : <Navbar />}
      <AppRoutes auth={auth} showToast={showToast} />
      <Footer />
      {toast && <Toast message={toast} />}
    </>
  );
}
