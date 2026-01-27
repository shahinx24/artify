export const authGuard = () => {
  const auth = JSON.parse(localStorage.getItem("auth"));
  if (!auth) return null;

  if (auth.role === "user" && auth.isActive === false) {
    localStorage.removeItem("auth");
    window.location.href = "/login";
  }

  return auth;
};