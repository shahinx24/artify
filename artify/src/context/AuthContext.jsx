import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext({
  auth: null,
  loading: true,
  login: () => {},
  logout: () => {},
  updateAuth: () => {},
  refreshKey: 0,
  triggerRefresh: () => {},
});

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0); // 🔥 IMPORTANT
  const navigate = useNavigate();

  useEffect(() => {
    const storedAuth = localStorage.getItem("auth");
    if (storedAuth) {
      setAuth(JSON.parse(storedAuth));
    }
    setLoading(false);
  }, []);

  const triggerRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "auth") {
        if (!e.newValue) {
          // logout other taps
          setAuth(null);
          navigate("/");
        } else {
          setAuth(JSON.parse(e.newValue));
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [navigate]);

  const login = (user) => {
    localStorage.setItem("auth", JSON.stringify(user));
    setAuth(user);
    triggerRefresh(); // 🔥 sync navbar + buttons

    navigate(user.role === "admin" ? "/admin" : "/");
  };

  const logout = () => {
    localStorage.removeItem("auth");
    setAuth(null);
    triggerRefresh(); // 🔥 reset cart/wishlist

    navigate("/");
  };

  const updateAuth = (updatedUser) => {
  localStorage.setItem("auth", JSON.stringify(updatedUser));
  setAuth(updatedUser);
  };

  return (
    <AuthContext.Provider
      value={{ auth, login, logout, loading, refreshKey, triggerRefresh, updateAuth }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);