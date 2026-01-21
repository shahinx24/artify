import { useState } from "react";
import axios from "axios";

export default function Login({ setAuthMode, showToast }) {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");

  const login = async (e) => {
    e.preventDefault();

    if (!email || !pass) return showToast("All fields required");

    // Fetch all users from DB
    const { data: users } = await axios.get("http://localhost:3000/users");

    const found = users.find(u => u.email === email && u.pass === pass);

    if (!found) return showToast("Invalid credentials");

    // Save logged in user to localStorage
    localStorage.setItem("user", JSON.stringify(found));

    showToast("Logged in!");
    setAuthMode(null); 
    window.location.reload(); // FORCE UI update (temporary)
  };

  return (
    <>
      <h3>Welcome Back</h3>

      <form onSubmit={login}>
        <input type="email" placeholder="Email" value={email}
               onChange={e => setEmail(e.target.value)} />

        <input type="password" placeholder="Password" value={pass}
               onChange={e => setPass(e.target.value)} />

        <button type="submit">LOGIN</button>

        <p onClick={() => setAuthMode("register")}>
          Don't have an account? Register
        </p>
      </form>
    </>
  );
}