import bcrypt from "bcrypt";
import User from "../models/User.js";

const SALT_ROUNDS = 10;

const normalizeUserPayload = (body = {}) => ({
  ...body,
  email: body.email?.trim().toLowerCase(),
});

const nextNumericId = async (Model) => {
  const docs = await Model.find({}, { id: 1, _id: 0 }).lean();
  const maxId = docs.reduce((max, doc) => {
    const value = Number(doc.id);
    return Number.isFinite(value) ? Math.max(max, value) : max;
  }, 0);

  return maxId + 1;
};

const hashPassword = async (password) => bcrypt.hash(password, SALT_ROUNDS);

const verifyPassword = async (plainPassword, storedPassword) => {
  if (typeof storedPassword !== "string") {
    return false;
  }

  if (storedPassword.startsWith("$2")) {
    return bcrypt.compare(plainPassword, storedPassword);
  }

  return plainPassword === storedPassword;
};

export const createUser = async (req, res) => {
  try {
    const payload = normalizeUserPayload(req.body);

    if (!payload.email || !payload.pass) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const existingUser = await User.findOne({ email: payload.email });
    if (existingUser) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    const hashedPassword = await hashPassword(payload.pass);

    const user = await User.create({
      id: payload.id || (await nextNumericId(User)),
      email: payload.email,
      pass: await hashPassword(payload.pass),
      role: payload.role || "user",
      cart: payload.cart || [],
      wishlist: payload.wishlist || [],
      isActive: payload.isActive ?? true,
    });

    res.status(201).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getUser = async (req, res) => {
  try {
    const query = {};

    if (req.query.email) {
      query.email = req.query.email.trim().toLowerCase();
    }

    if (req.query.isActive !== undefined) {
      query.isActive = req.query.isActive === "true";
    }

    const users = await User.find(query).lean();
    res.status(200).json(users);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await User.findOne({ id: Number(req.params.id) }).lean();

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message,
    });
  }
};

const saveUser = async (req, res) => {
  try {
    const payload = normalizeUserPayload(req.body);

    if (payload.email) {
      const existingUser = await User.findOne({
        email: payload.email,
        id: { $ne: String(req.params.id) },
      }).lean();

      if (existingUser) {
        return res.status(400).json({
          message: "Email already exists",
        });
      }
    }

    delete payload._id;
    delete payload.createdAt;
    delete payload.updatedAt;

    if (payload.pass) {
      payload.pass = await hashPassword(payload.pass);
    }

    const updatedUser = await User.findOneAndUpdate(
      { id: Number(req.params.id) },
      payload,
      {
        new: true,
        runValidators: true,
      }
    ).lean();

    if (!updatedUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message,
    });
  }
};

export const updateUser = async (req, res) => {
  return saveUser(req, res);
};

export const patchUser = async (req, res) => {
  return saveUser(req, res);
};

export const loginUser = async (req, res) => {
  try {
    const email = req.body.email?.trim().toLowerCase();
    const pass = req.body.pass;

    const user = await User.findOne({ email }).lean();
    if (!user) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const isPasswordValid = await verifyPassword(pass, user.pass);
    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        message: "Account deactivated",
      });
    }

    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message,
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findOneAndDelete({
      id: Number(req.params.id),
    }).lean();

    if (!deletedUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      message: "User deleted successfully",
      deletedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message,
    });
  }
};
