import bcrypt from "bcrypt";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

import { normalizeEmail } from "../utils/normalize.js";

// Password Configuration
const SALT_ROUNDS =
  Number(process.env.SALT_ROUNDS) || 10;

// Normalize User Payload
const normalizeUserPayload = (body = {}) => ({
  ...body,
  email: body.email
    ? normalizeEmail(body.email)
    : body.email,
});

// Generate Next Numeric User ID
const nextNumericId = async (Model) => {
  const result = await Model.aggregate([
    {
      $group: {
        _id: null,
        maxId: {
          $max: "$id",
        },
      },
    },
  ]);

  return (result[0]?.maxId || 0) + 1;
};

// Hash Password
const hashPassword = async (password) => {
  return bcrypt.hash(password, SALT_ROUNDS);
};

// Verify Password
const verifyPassword = async (
  plainPassword,
  storedPassword
) => {
  if (typeof storedPassword !== "string") {
    return false;
  }

  // Bcrypt hashed password
  if (storedPassword.startsWith("$2")) {
    return bcrypt.compare(
      plainPassword,
      storedPassword
    );
  }

  // Support old plain-text passwords
  return plainPassword === storedPassword;
};

// Create User
export const createUser = async (req, res) => {
  try {
    const payload = normalizeUserPayload(req.body);

    // Validate required fields
    if (!payload.email || !payload.pass) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    // Check duplicate email
    const existingUser = await User.findOne({
      email: payload.email,
    }).lean();

    if (existingUser) {
      return res.status(409).json({
        message: "Email already exists",
      });
    }

    // Hash password
    const hashedPassword = await hashPassword(
      payload.pass
    );

    // Create user
    const user = await User.create({
      id:
        payload.id ||
        (await nextNumericId(User)),

      email: payload.email,

      pass: hashedPassword,

      role: payload.role || "user",

      isActive:
        payload.isActive ?? true,
    });

    // Remove password from response
    const {
      pass: _,
      ...userWithoutPassword
    } = user.toObject();


    return res.status(201).json(
      userWithoutPassword
    );

  } catch (error) {
    console.error("createUser error:", error);

    return res.status(500).json({
      message: error.message,
    });
  }
};

// Get Users
export const getUser = async (req, res) => {
  try {
    const query = {};

    // Filter by email
    if (req.query.email) {
      query.email = normalizeEmail(
        req.query.email
      );
    }

    // Filter by active status
    if (req.query.isActive !== undefined) {
      query.isActive =
        req.query.isActive === "true";
    }


    const users = await User.find(query)
      .select("-pass")
      .lean();


    return res.status(200).json(users);

  } catch (error) {
    console.error("getUser error:", error);

    return res.status(500).json({
      message: error.message,
    });
  }
};

// Get User By ID
export const getUserById = async (req, res) => {
  try {
    const userId = Number(req.params.id);

    const user = await User.findOne({
      id: userId,
    })
      .select("-pass")
      .lean();


    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json(user);

  } catch (error) {
    console.error(
      "getUserById error:",
      error
    );

    return res.status(500).json({
      message: error.message,
    });
  }
};

// Shared User Update Helper
const saveUser = async (req, res) => {
  try {
    const userId = Number(req.params.id);

    const payload = normalizeUserPayload(
      req.body
    );

    delete payload._id;
    delete payload.createdAt;
    delete payload.updatedAt;
    delete payload.id;

    if (payload.email) {
      const existingUser =
        await User.findOne({
          email: payload.email,
          id: {
            $ne: userId,
          },
        }).lean();


      if (existingUser) {
        return res.status(409).json({
          message: "Email already exists",
        });
      }
    }

    if (payload.pass) {
      payload.pass = await hashPassword(
        payload.pass
      );
    }

    const updatedUser =
      await User.findOneAndUpdate(
        {
          id: userId,
        },
        payload,
        {
          new: true,
          runValidators: true,
        }
      )
        .select("-pass")
        .lean();

    if (!updatedUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json(
      updatedUser
    );

  } catch (error) {
    console.error("saveUser error:", error);

    return res.status(400).json({
      message: error.message,
    });
  }
};

// Update User
export const updateUser = async (req, res) => {
  return saveUser(req, res);
};

// Patch User
export const patchUser = async (req, res) => {
  return saveUser(req, res);
};

// Login User
export const loginUser = async (req, res) => {
  try {
    const email = normalizeEmail(
      req.body.email
    );

    const pass = req.body.pass;

    // Validate input
    if (!email || !pass) {
      return res.status(400).json({
        message:
          "Email and password are required",
      });
    }

    // Find user
    const user = await User.findOne({
      email,
    })
      .select("+pass")
      .lean();

    if (!user) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    // Verify password
    const isPasswordValid =
      await verifyPassword(
        pass,
        user.pass
      );


    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    // Check account status
    if (!user.isActive) {
      return res.status(403).json({
        message: "Account deactivated",
      });
    }

    // Check JWT secret
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({
        message:
          "JWT secret is not configured.",
      });
    }

    // Generate JWT
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },

      process.env.JWT_SECRET,

      {
        expiresIn:
          process.env.JWT_EXPIRES_IN || "7d",
      }
    );

    // Remove password
    const {
      pass: _,
      ...userWithoutPassword
    } = user;

    return res.status(200).json({
      message: "Login successful",
      token,
      user: userWithoutPassword,
    });

  } catch (error) {
    console.error("loginUser error:", error);

    return res.status(500).json({
      message: error.message,
    });
  }
};

// Logout User
export const logoutUser = async (req, res) => {
  return res.status(200).json({
    message: "Logout successful",
  });
};

// Delete User
export const deleteUser = async (req, res) => {
  try {
    const userId = Number(req.params.id);

    const deletedUser =
      await User.findOneAndDelete({
        id: userId,
      }).lean();


    if (!deletedUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Remove password
    const {
      pass: _,
      ...userWithoutPassword
    } = deletedUser;


    return res.status(200).json({
      message: "User deleted successfully",
      deletedUser: userWithoutPassword,
    });

  } catch (error) {
    console.error("deleteUser error:", error);

    return res.status(500).json({
      message: error.message,
    });
  }
};