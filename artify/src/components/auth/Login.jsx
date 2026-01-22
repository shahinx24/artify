import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login({ setAuthMode, showToast }) {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const navigate = useNavigate();

  const ADMIN_EMAIL = "shahin@gmail.com";
  const ADMIN_PASS = "Shahin@12";

  const login = async (e) => {
    e.preventDefault();

    //Admin
    if (email === ADMIN_EMAIL && pass === ADMIN_PASS) {
      localStorage.setItem(
        "admin",
        JSON.stringify({ email: ADMIN_EMAIL, role: "admin" })
      );

      setAuthMode(null);
      navigate("/admin"); 
      return;
    }

    const { data: users } = await axios.get("http://localhost:3000/users");

    const found = users.find(
      (u) => u.email === email && u.pass === pass
    );

    if (!found) return showToast("Invalid credentials");

    const authData = {
      id: found.id,
      email: found.email,
      role: found.role,
    };

    localStorage.setItem("auth", JSON.stringify(authData));

    setAuthMode(null);
    window.location.reload();
  };

  return (
    <>
      <h3>Welcome Back</h3>

      <form onSubmit={login}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={pass}
          onChange={(e) => setPass(e.target.value)}
        />

        <button type="submit">LOGIN</button>

        <p onClick={() => setAuthMode("register")}>
          Don't have an account? Register
        </p>
      </form>
    </>
  );
}
