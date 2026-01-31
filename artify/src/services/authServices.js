import api from "./api";
import { API_USERS, API_ADMINS } from "../hooks/useAuth";

export const normalizeUser = (u, role = "user") => ({
  id: u.id,
  email: u.email,
  role,
  cart: u.cart ?? [],
  wishlist: u.wishlist ?? [],
  isActive: u.isActive ?? true,
});

// -Login
export async function loginUser({ email, pass }) {
  if (!email || !pass) {
    throw new Error("All fields required");
  }

  // Admin check
  const { data: admins } = await api.get("/admins");
  const admin = admins.find(
    a => a.email === email && a.password === pass
  );

  if (admin) {
    return normalizeUser(admin, "admin");
  }

  // User check
  const { data: users } = await api.get("/users");
  const user = users.find(
    u => u.email === email && u.pass === pass
  );

  if (!user) {
    throw new Error("Invalid credentials");
  }

  if (!user.isActive) {
    throw new Error("Account deactivated");
  }

  return normalizeUser(user);
}

// Register
export async function registerUser({ email, pass, confirm }) {
  if (!email || !pass || !confirm)
    throw new Error("All fields required");

  if (pass !== confirm)
    throw new Error("Passwords don't match");

  const { data: users } = await api.get("/users");
  if (users.find(u => u.email === email))
    throw new Error("User already exists");

  await api.post("/users", {
    email,
    pass,
    role: "user",
    cart: [],
    wishlist: [],
    isActive: true,
  });

  return true;
}