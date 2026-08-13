import api from "./api";

export const normalizeUser = (u, role = "user") => ({
  id: u.id,
  email: u.email,
  role,
  cart: u.cart ?? [],
  wishlist: u.wishlist ?? [],
  isActive: u.isActive ?? true,
});
export async function loginUser({ email, pass }) {
  if (!email || !pass) {
    throw new Error("All fields required");
  }

  const normalizedEmail = email
    .trim()
    .toLowerCase();

  const { data } = await api.post("/auth/login", {
    email: normalizedEmail,
    pass,
  });

  localStorage.setItem("token", data.token);

  return normalizeUser(data.user, data.user.role);
}

// Register
export async function registerUser({ email, pass, confirm }) {
  if (!email || !pass || !confirm)
    throw new Error("All fields required");

  if (pass !== confirm)
    throw new Error("Passwords don't match");

  await api.post("/users", {
    email: email.trim().toLowerCase(),
    pass,
    role: "user",
    cart: [],
    wishlist: [],
    isActive: true,
  });

  return true;
}

export async function logoutUser() {
  await api.post("/users/logout");
}
