import { useState } from "react";
import axios from "axios";

export default function Login({ setAuthMode }) {
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");

  const login = async(e)=>{
    e.preventDefault();

    const {data:users} = await axios.get("http://localhost:3000/users");
    const user = users.find(u=>u.email===email);

    if(!user) return showToast("User not found");
    if(user.password !== password) return showToast("Incorrect password");

    localStorage.setItem("user", JSON.stringify(user));
    window.location.reload();
  };

  return (
    <form onSubmit={login}>
      <h3>Login</h3>
      <input placeholder="Email" value={email}
        onChange={e=>setEmail(e.target.value)} required />

      <input type="password" placeholder="Password"
        value={password} onChange={e=>setPassword(e.target.value)} required />

      <button type="submit">Login</button>

      <p onClick={()=>setAuthMode("register")}>Create account</p>
    </form>
  );
}