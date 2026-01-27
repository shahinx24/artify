export const authGuard = async () => {
  const auth = JSON.parse(localStorage.getItem("auth"));
  if (!auth || auth.role !== "user") return null;

  const res = await fetch(`http://localhost:3000/users/${auth.id}`);
  const freshUser = await res.json();

  if (!freshUser.isActive) {
    localStorage.removeItem("auth");
    return "Your account has been deactivated";
  }

  return null;
};