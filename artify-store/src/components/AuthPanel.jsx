export default function AuthPanel({ authMode, setAuthMode }) {
  if (!authMode) return null; 

  return (
    <div className="auth-box">
      {authMode === "login"    && <LoginForm setAuthMode={setAuthMode} />}
      {authMode === "register" && <RegisterForm setAuthMode={setAuthMode} />}
      {authMode === "forgot"   && <ForgotForm setAuthMode={setAuthMode} />}
      {authMode === "otp"      && <OtpForm setAuthMode={setAuthMode} />}
      {authMode === "reset"    && <ResetForm setAuthMode={setAuthMode} />}
    </div>
  );
}