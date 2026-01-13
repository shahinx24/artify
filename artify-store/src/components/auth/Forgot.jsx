import { useState } from "react";

export default function Forgot({ setAuthMode }) {
  const [email, setEmail] = useState("");

  const sendOtp = () => {
    alert("OTP Sent (simulation)");
    setAuthMode("otp");
  };

  return (
    <form onSubmit={e => { e.preventDefault(); sendOtp(); }}>
      <h3>Forgot Password</h3>
      <input placeholder="Enter email" required onChange={(e)=>setEmail(e.target.value)} />
      <button type="submit">Send OTP</button>

      <p onClick={() => setAuthMode("login")}>Back to Login</p>
    </form>
  );
}