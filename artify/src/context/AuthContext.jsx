import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext(null);

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

  return (
    <AuthContext.Provider
      value={{ auth, login, logout, loading, refreshKey, triggerRefresh }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);