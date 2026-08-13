import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../services/authServices";

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
  const [refreshKey, setRefreshKey] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const storedAuth = localStorage.getItem("auth");
    const token = localStorage.getItem("token");
    if (storedAuth && token) {
      try {
        const parsedAuth = JSON.parse(storedAuth);
        if (parsedAuth?.id && ["user", "admin"].includes(parsedAuth.role)) {
          setAuth(parsedAuth);
        } else {
          localStorage.removeItem("auth");
          localStorage.removeItem("token");
        }
      } catch {
        localStorage.removeItem("auth");
        localStorage.removeItem("token");
      }
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
          try {
            setAuth(JSON.parse(e.newValue));
          } catch {
            setAuth(null);
          }
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
    triggerRefresh();

    navigate(user.role === "admin" ? "/admin/dashboard" : "/");
  };

  const logout = useCallback(async () => {
    const token = localStorage.getItem("token");

    try {
      if (token) {
        await logoutUser();
      }
    } catch (error) {
      console.error("Logout request failed", error);
    } finally {
      localStorage.removeItem("auth");
      localStorage.removeItem("token");
      setAuth(null);
      setRefreshKey(prev => prev + 1);

      navigate("/");
    }
  }, [navigate]);

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
