import bcrypt from "bcrypt";
import User from "../models/User.js";

import { normalizeEmail } from "../utils/normalize.js";
import { authenticateAccount } from "../services/authenticationService.js";

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

      role: "user",

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
    const result = await authenticateAccount({
      email: req.body.email,
      pass: req.body.pass,
      roles: ["user"],
    });

    return res.status(200).json({ message: "Login successful", ...result });

  } catch (error) {
    console.error("loginUser error:", error);

    return res.status(error.statusCode || 500).json({
      message: error.statusCode ? error.message : "Server Error",
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
