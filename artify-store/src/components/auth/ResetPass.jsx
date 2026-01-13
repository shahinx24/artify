import { useState } from "react";

export default function ResetPass({ setAuthMode }) {
  const [pw, setPw] = useState("");

  const reset = () => {
    alert("Password Reset (simulate)");
    setAuthMode("login");
  };

  return (
    <form onSubmit={e=>{e.preventDefault(); reset();}}>
      <h3>Reset Password</h3>
      <input type="password" placeholder="New Password" required onChange={(e)=>setPw(e.target.value)} />
      <button type="submit">Update Password</button>
    </form>
  );
}