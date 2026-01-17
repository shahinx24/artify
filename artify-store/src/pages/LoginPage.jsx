import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ENV } from "../constants/env";
import { saveUser } from "../utils/userHelpers";
import { ROUTES } from "../constants/routes";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const res = await fetch(
      `${ENV.API_BASE_URL}/users?email=${email}&password=${password}`
    );
    const users = await res.json();

    if (users.length === 0) {
      alert("Invalid credentials");
      return;
    }

    saveUser(users[0]);
    navigate(ROUTES.HOME);
  };

  return (
    <div className="auth-page">
      <h2>Login</h2>

      <form onSubmit={handleLogin} className="auth-form">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Login</button>
      </form>
    </div>
  );
}