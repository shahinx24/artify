import { useState } from "react";
import axios from "axios";

export default function Register({ setAuthMode, showToast }) {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [confirm, setConfirm] = useState("");

  const validateEmail = (email) => {
    return email.includes("@") && email.includes(".com");
  };

  const validatePassword = (p) => {
    const hasUpper = /[A-Z]/.test(p);
    const hasLower = /[a-z]/.test(p);
    const hasNum = /[0-9]/.test(p);
    const hasSpecial = /[^A-Za-z0-9]/.test(p);
    return p.length >= 6 && hasUpper && hasLower && hasNum && hasSpecial;
  };

const register = async (e) => {
  e.preventDefault();

  if (!email || !pass || !confirm) return showToast("All fields required");
  if (pass !== confirm) return showToast("Passwords don't match");

  const { data: users } = await axios.get("http://localhost:3000/users");
  if (users.find(u => u.email === email)) {
    return showToast("User already exists");
  }
  if (!validateEmail(email)) {
    return showToast("Invalid email format");
  }
  if (!validatePassword(pass)) {
    return showToast("Password must be at least 6 characters and include uppercase, lowercase, number, and special character");
  }
  
  // Create new user with empty cart + wishlist
  const newUser = {
    email,
    pass,
    cart: [],
    wishlist: []
  };
  // push the new user into db.json
  const res = await axios.post("http://localhost:3000/users", newUser);

  showToast("Registered! Login now");
  setAuthMode("login");
};

  return (
    <>
      <h3>Create Account</h3>
      <form onSubmit={register}>
        <input type="email" placeholder="Email" onChange={e=>setEmail(e.target.value)} />
        <input type="password" placeholder="Password" onChange={e=>setPass(e.target.value)} />
        <input type="password" placeholder="Confirm Password" onChange={e=>setConfirm(e.target.value)} />
        <button type="submit">REGISTER</button>
        <p onClick={()=>setAuthMode("login")}>Already have an account? Login</p>
      </form>
    </>
  );
}
