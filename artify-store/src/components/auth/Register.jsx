import { useState } from "react";
import axios from "axios";

export default function Register({ setAuthMode }) {
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [confirm,setConfirm] = useState("");

  const register = async(e)=>{
    e.preventDefault();

    if(password !== confirm) return showToast("Passwords don't match");

    const {data:users} = await axios.get("http://localhost:3000/users");
    if(users.find(u=>u.email === email)) return showToast("Email already exists");

    await axios.post("http://localhost:3000/users",{
      email,
      password,
      cart: [],
      wishlist: []
    });

    showToast("Account created!");
    setAuthMode("login");
  };

  return (
    <form onSubmit={register}>
      <h3>Create Account</h3>
      <input type="email" placeholder="Email"
        value={email} onChange={e=>setEmail(e.target.value)} required />

      <input type="password" placeholder="Password"
        value={password} onChange={e=>setPassword(e.target.value)} required />

      <input type="password" placeholder="Confirm Password"
        value={confirm} onChange={e=>setConfirm(e.target.value)} required />

      <button type="submit">Register</button>

      <p onClick={()=>setAuthMode("login")}>Already have account?</p>
    </form>
  );
}