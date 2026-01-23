import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login({ setAuthMode, showToast }) {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const navigate = useNavigate();
  const login = async (e) => {
   e.preventDefault();

    // ADMIN LOGIN
    const { data: admins } = await axios.get("http://localhost:3000/admins");

    const admin = admins.find(
      (a) => a.email === email && a.password === pass
    );

    if (admin) {
      localStorage.setItem(
        "auth",
        JSON.stringify({
          id: admin.id,
          email: admin.email,
          role: "admin",
        })
      );

      setAuthMode(null);
      navigate("/admin");
      return;
    }

    // USER LOGIN
    const { data: users } = await axios.get("http://localhost:3000/users");

    const found = users.find(
      (u) => u.email === email && u.pass === pass
    );

    if (!found) return showToast("Invalid credentials");

    localStorage.setItem(
      "auth",
      JSON.stringify({
        id: found.id,
        email: found.email,
        role: found.role,
      })
    );

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
