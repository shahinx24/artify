import api from "./api";

export const normalizeUser = (u, role = "user") => ({
  id: u.id,
  email: u.email,
  role,
  cart: u.cart ?? [],
  wishlist: u.wishlist ?? [],
  isActive: u.isActive ?? true,
});

// Login
export async function loginUser({ email, pass }) {
  if (!email || !pass) {
    throw new Error("All fields required");
  }

  const normalizedEmail = email.trim().toLowerCase();

  try {
    const { data } = await api.post("/admins/login", {
      email: normalizedEmail,
      pass,
    });

    localStorage.setItem("token", data.token);

    const { data } = await api.post("/admins/login", {
      email: normalizedEmail,
      pass,
    });

    return normalizeUser(data, "admin");
  } catch (adminError) {
    const status = adminError.response?.status;

    if (status && status !== 401 && status !== 404) {
      throw new Error(adminError.response?.data?.message || "Login failed");
    }

    if (!status && adminError.request) {
      throw new Error("Cannot reach the server");
    }
  }

  try {
    const { data } = await api.post("/users/login", {
      email: normalizedEmail,
      pass,
    });

    localStorage.setItem("token", data.token);

    return normalizeUser(data.user);
  } catch (userError) {
    throw new Error(userError.response?.data?.message || "Login failed");
  }
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