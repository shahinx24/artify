import Admin from "../models/Admin.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

// Helper: Verify Password
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

// Helper: Generate Next Numeric Admin ID
const nextNumericId = async () => {
  const result = await Admin.aggregate([
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

// Create Admin
export const createAdmin = async (req, res) => {
  try {
    const { email, pass } = req.body;

    // Validate required fields
    if (!email || !pass) {
      return res.status(400).json({
        message: "Email and password are required.",
      });
    }

    // Normalize email
    const normalizedEmail = email
      .trim()
      .toLowerCase();

    // Check duplicate email
    const existingAdmin = await Admin.findOne({
      email: normalizedEmail,
    }).lean();

    if (existingAdmin) {
      return res.status(409).json({
        message: "Email already exists.",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(
      pass,
      10
    );

    // Generate numeric ID
    const id =
      Number(req.body.id) ||
      (await nextNumericId());

    // Create admin
    const admin = await Admin.create({
      ...req.body,
      id,
      email: normalizedEmail,
      pass: hashedPassword,
    });

    // Remove password from response
    const {
      pass: _,
      ...adminData
    } = admin.toObject();

    return res.status(201).json(adminData);

  } catch (error) {
    console.error(
      "createAdmin error:",
      error
    );

    return res.status(400).json({
      message: error.message,
    });
  }
};

// Login Admin
export const loginAdmin = async (req, res) => {
  try {
    const { email, pass } = req.body;

    // Validate input
    if (!email || !pass) {
      return res.status(400).json({
        message: "Email and password are required.",
      });
    }

    // Check JWT secret
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({
        message: "JWT secret is not configured.",
      });
    }

    // Normalize email
    const normalizedEmail = email
      .trim()
      .toLowerCase();

    // Find admin
    const admin = await Admin.findOne({
      email: normalizedEmail,
    })
      .select("+pass")
      .lean();

    if (!admin) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // Verify password
    const isMatch = await verifyPassword(
      pass,
      admin.pass
    );

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // Generate JWT
    const token = jwt.sign(
      {
        id: admin.id,
        role: admin.role,
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
      ...adminData
    } = admin;

    return res.status(200).json({
      message: "Login successful",
      token,
      user: adminData,
    });

  } catch (error) {
    console.error(
      "loginAdmin error:",
      error
    );

    return res.status(500).json({
      message: "Server Error",
    });
  }
};

// Get All Admins
export const getAllAdmins = async (
  req,
  res
) => {
  try {
    const admins = await Admin.find()
      .select("-pass")
      .lean();

    return res.status(200).json(admins);

  } catch (error) {
    console.error(
      "getAllAdmins error:",
      error
    );

    return res.status(500).json({
      message: error.message,
    });
  }
};

// Get Admin By ID
export const getAdminById = async (
  req,
  res
) => {
  try {
    const admin = await Admin.findOne({
      id: Number(req.params.id),
    })
      .select("-pass")
      .lean();

    if (!admin) {
      return res.status(404).json({
        message: "Admin not found",
      });
    }

    return res.status(200).json(admin);

  } catch (error) {
    console.error(
      "getAdminById error:",
      error
    );

    return res.status(500).json({
      message: error.message,
    });
  }
};

// Shared Admin Update Helper
const saveAdmin = async (req, res) => {
  try {
    const adminId = Number(
      req.params.id
    );

    const payload = {
      ...req.body,
    };

    delete payload._id;
    delete payload.createdAt;
    delete payload.updatedAt;
    delete payload.id;

    if (payload.email) {
      payload.email = payload.email
        .trim()
        .toLowerCase();


      // Check duplicate email
      const existingAdmin =
        await Admin.findOne({
          email: payload.email,
          id: {
            $ne: adminId,
          },
        }).lean();

      if (existingAdmin) {
        return res.status(409).json({
          message: "Email already exists.",
        });
      }
    }

    if (payload.pass) {
      payload.pass =
        await bcrypt.hash(
          payload.pass,
          10
        );
    }

    const admin =
      await Admin.findOneAndUpdate(
        {
          id: adminId,
        },
        payload,
        {
          new: true,
          runValidators: true,
        }
      )
        .select("-pass")
        .lean();

    if (!admin) {
      return res.status(404).json({
        message: "Admin not found",
      });
    }

    return res.status(200).json(admin);

  } catch (error) {
    console.error(
      "saveAdmin error:",
      error
    );

    return res.status(400).json({
      message: error.message,
    });
  }
};

// Update Admin
export const updateAdmin = async (
  req,
  res
) => {
  return saveAdmin(req, res);
};

// Patch Admin
export const patchAdmin = async (
  req,
  res
) => {
  return saveAdmin(req, res);
};

// Delete Admin
export const deleteAdmin = async (
  req,
  res
) => {
  try {
    const admin =
      await Admin.findOneAndDelete({
        id: Number(req.params.id),
      }).lean();


    if (!admin) {
      return res.status(404).json({
        message: "Admin not found",
      });
    }

    return res.status(200).json({
      message: "Admin deleted successfully",
    });

  } catch (error) {
    console.error(
      "deleteAdmin error:",
      error
    );

    return res.status(500).json({
      message: error.message,
    });
  }
};