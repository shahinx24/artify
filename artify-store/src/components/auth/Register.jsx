import { useState } from "react";

export default function Register({ setAuthMode, showToast }) {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [confirm, setConfirm] = useState("");
  const register = async (e) => {
    e.preventDefault();

    if (!email || !pass || !confirm) {
      showToast("All fields required");
      return;
    }

    if (pass !== confirm) {
      showToast("Passwords do not match");
      return;
    }

    const savedUsers = JSON.parse(localStorage.getItem("users") || "[]");
    const exists = savedUsers.find(u => u.email === email);
    
    if (exists) {
      showToast("User already exists");
      return;
    }
    const newUser = { email, pass };

    // save account to users list
    localStorage.setItem("users", JSON.stringify([...savedUsers, newUser]));

    showToast("Registration successful! Now login.");
    setAuthMode("login");
  };

  return (
    <>
      <h3>Create Account</h3>
      <form onSubmit={register}>
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
        <input
          type="password"
          placeholder="Confirm Password"
          onChange={(e) => setConfirm(e.target.value)}
        />
        <button type="submit">REGISTER</button>
        <p onClick={() => setAuthMode("login")}>
          Already have an account? Login
        </p>
      </form>
    </>
  );
}