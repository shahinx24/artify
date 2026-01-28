import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Load auth from localStorage on app start
  useEffect(() => {
    const storedAuth = localStorage.getItem("auth");
    if (storedAuth) {
      setAuth(JSON.parse(storedAuth));
    }
    setLoading(false);
  }, []);

  // LOGIN
  const login = (user) => {
    localStorage.setItem("auth", JSON.stringify(user));
    setAuth(user);

    // role-based redirect
    if (user.role === "admin") {
      navigate("/admin");
    } else {
      navigate("/");
    }
  };

  // LOGOUT
  const logout = () => {
    localStorage.removeItem("auth");
    setAuth(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);