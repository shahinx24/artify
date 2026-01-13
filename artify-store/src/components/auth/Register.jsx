import { useState } from "react";
import axios from "axios";

export default function Register({ setAuthMode }) {
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    const { data: users } = await axios.get("http://localhost:3000/users");
    if (users.find(u => u.email === email)) {
      return alert("Email already exists");
    }

    await axios.post("http://localhost:3000/users", { email, password });
    alert("Account Created!");
    setAuthMode("login");
  };

  return (
    <form onSubmit={handleRegister}>
      <h3>Register</h3>
      <input placeholder="Email" onChange={(e)=>setEmail(e.target.value)} required />
      <input type="password" placeholder="Password" onChange={(e)=>setPassword(e.target.value)} required />
      <button type="submit">Register</button>

      <p onClick={() => setAuthMode("login")}>Already have account? Login</p>
    </form>
  );
}