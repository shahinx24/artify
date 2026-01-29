import axios from "axios";

const API = "http://localhost:3000/users";

const validateEmail = (email) =>
  email.includes("@") && email.includes(".com");

const validatePassword = (p) => {
  return (
    p.length >= 6 &&
    /[A-Z]/.test(p) &&
    /[a-z]/.test(p) &&
    /[0-9]/.test(p) &&
    /[^A-Za-z0-9]/.test(p)
  );
};

export async function loginUser({ email, pass }, showToast) {
  if (!email || !pass) {
    alert("All fields required");
    return null;
  }

  const { data: users } = await axios.get(API);
  const user = users.find(u => u.email === email && u.pass === pass);

  if (!user) {
    alert("Invalid credentials");
    return null;
  }

  return user;
}

export async function registerUser({ email, pass, confirm }, showToast) {
  if (!email || !pass || !confirm) {
    alert("All fields required");
    return false;
  }

  if (pass !== confirm) {
    alert("Passwords don't match");
    return false;
  }

  if (!validateEmail(email)) {
    alert("Invalid email format");
    return false;
  }

  if (!validatePassword(pass)) {
    alert(
      "Password must include uppercase, lowercase, number & special character"
    );
    return false;
  }

  const { data: users } = await axios.get(API);
  if (users.find(u => u.email === email)) {
    alert("User already exists");
    return false;
  }

  await axios.post(API, {
    email,
    pass,
    cart: [],
    wishlist: [],
  });

  return true;
}