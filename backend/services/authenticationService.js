import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import Admin from "../models/Admin.js";
import User from "../models/User.js";
import { normalizeEmail } from "../utils/normalize.js";

const loginError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const verifyPassword = (password, passwordHash) => {
  if (typeof passwordHash !== "string" || !passwordHash.startsWith("$2")) {
    return false;
  }

  return bcrypt.compare(password, passwordHash);
};

const createToken = (account, role) => {
  if (!process.env.JWT_SECRET) {
    throw loginError("JWT secret is not configured.", 500);
  }

  return jwt.sign(
    { id: account.id, email: account.email, role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
};

export const authenticateAccount = async ({ email, pass, roles }) => {
  const normalizedEmail = normalizeEmail(email);

  if (!normalizedEmail || !pass) {
    throw loginError("Email and password are required", 400);
  }

  const lookups = [];
  if (roles.includes("user")) {
    lookups.push(User.findOne({ email: normalizedEmail }).select("+pass").lean()
      .then((account) => ({ account, role: "user" })));
  }
  if (roles.includes("admin")) {
    lookups.push(Admin.findOne({ email: normalizedEmail }).select("+pass").lean()
      .then((account) => ({ account, role: "admin" })));
  }

  const candidates = (await Promise.all(lookups)).filter(({ account }) => account);
  const matches = [];

  for (const candidate of candidates) {
    if (await verifyPassword(pass, candidate.account.pass)) {
      matches.push(candidate);
    }
  }

  if (matches.length === 0) {
    throw loginError("Invalid credentials", 401);
  }

  // An email must identify exactly one authenticated account across roles.
  if (matches.length > 1) {
    throw loginError("Account role is ambiguous. Contact support.", 409);
  }

  const { account, role } = matches[0];
  if (role === "user" && !account.isActive) {
    throw loginError("Account deactivated", 403);
  }

  const { pass: _, ...accountData } = account;
  return {
    token: createToken(account, role),
    user: { ...accountData, role },
  };
};
