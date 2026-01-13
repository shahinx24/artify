import { useState } from "react";
import axios from "axios";

export default function Login({ setAuthMode }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    const { data: users } = await axios.get("http://localhost:3000/users");
    const user = users.find(u => u.email === email && u.password === password);

    if (!user) return alert("Invalid Credentials");
    alert("Logged in!");
  };

  return (
    <form onSubmit={handleLogin}>
      <h3>Login</h3>
      <input placeholder="Email" onChange={(e)=>setEmail(e.target.value)} required />
      <input type="password" placeholder="Password" onChange={(e)=>setPassword(e.target.value)} required />
      <button type="submit">Login</button>

      <p onClick={() => setAuthMode("register")}>Not registered? Create account</p>
      <p onClick={() => setAuthMode("forgot")}>Forgot password?</p>
    </form>
  );
}