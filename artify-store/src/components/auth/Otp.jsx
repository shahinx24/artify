import { useState } from "react";

export default function Otp({ setAuthMode }) {
  const [otp, setOtp] = useState("");

  const verifyOtp = () => {
    alert("OTP Verified");
    setAuthMode("reset");
  };

  return (
    <form onSubmit={e=>{e.preventDefault(); verifyOtp();}}>
      <h3>Verify OTP</h3>
      <input placeholder="Enter OTP" required onChange={(e)=>setOtp(e.target.value)} />
      <button type="submit">Verify</button>
    </form>
  );
}