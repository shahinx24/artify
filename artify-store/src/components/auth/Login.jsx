import { useState } from "react";

export default function Login({ setAuthMode, showToast }) {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const login = (e) => {
    e.preventDefault();

    if (!email || !pass) {
      showToast("Please fill in all fields");
      return;
    }

    // Read all saved users
    const savedUsers = JSON.parse(localStorage.getItem("users") || "[]");
    // Find a matching user
    const user = savedUsers.find(u => u.email === email && u.pass === pass);

    if (!user) {
      showToast("Invalid email or password");
      return;
    }

    // Save current user
    localStorage.setItem("user", JSON.stringify({ email }));
    // Create user cart & wishlist keys if not exists
    const cartKey = `cart_${email}`;
    const wishKey = `wishlist_${email}`;

    if (!localStorage.getItem(cartKey)) {
      localStorage.setItem(cartKey, JSON.stringify([]));
    }
    if (!localStorage.getItem(wishKey)) {
      localStorage.setItem(wishKey, JSON.stringify([]));
    }

    showToast("Login successful!");
    setAuthMode(null);
    window.location.reload(); // refresh UI
  };

  return (
    <>
      <h3>Welcome Back</h3>
      <form onSubmit={login}>
        <input
          type="email"
          placeholder="Email address"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
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