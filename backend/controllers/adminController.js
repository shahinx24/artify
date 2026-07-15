import Admin from "../models/Admin.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const nextNumericId = async () => {
  const docs = await Admin.find({}, { id: 1, _id: 0 }).lean();

  const maxId = docs.reduce(
    (max, doc) => Math.max(max, doc.id),
    0
  );

  return maxId + 1;
};

// Create Admin
export const createAdmin = async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.pass, 10);

    const { email, pass } = req.body;

    if (!email || !pass) {
      return res.status(400).json({
        message: "Email and password are required.",
      });
    }

    const existingAdmin = await Admin.findOne({
      email: email.trim().toLowerCase(),
    });

    if (existingAdmin) {
      return res.status(409).json({
        message: "Email already exists.",
      });
    }

    const admin = await Admin.create({
      ...req.body,
      id: req.body.id || (await nextNumericId()),
      email: req.body.email?.trim().toLowerCase(),
      pass: hashedPassword
    });
    const { pass: _, ...adminData } = admin.toObject();

    res.status(201).json(adminData);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const loginAdmin = async (req, res) => {
  try {
    const { email, pass } = req.body;

    const admin = await Admin.findOne({
      email: email.trim().toLowerCase(),
    })
      .select("+pass")
      .lean();

    if (!admin) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(pass, admin.pass);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({
        message: "JWT secret is not configured.",
      });
    }

    const token = jwt.sign(
      {
        id: admin.id,
        role: admin.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN || "7d",
      }
    );

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({
        message: "JWT secret is not configured.",
      });
    }

    const { pass: _, ...adminData } = admin;

    res.status(200).json({
      token,
      user: adminData,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

// Get All Admins
export const getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.find()
      .select("-pass")
      .lean();
    res.status(200).json(admins);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Admin By id
export const getAdminById = async (req, res) => {
  try {
    const admin = await Admin.findOne({
      id: Number(req.params.id),
    })
      .select("-pass")
      .lean();

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.status(200).json(admin);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const saveAdmin = async (req, res) => {
  try {
    const payload = { ...req.body };
    delete payload._id;
    delete payload.createdAt;
    delete payload.updatedAt;

    if (payload.email) {
      payload.email = payload.email.trim().toLowerCase();
    }

    if (payload.pass) {
      payload.pass = await bcrypt.hash(payload.pass, 10);
    }

    const admin = await Admin.findOneAndUpdate(
      { id: Number(req.params.id) },
      payload,
      {
        new: true,
        runValidators: true
      }
    )
      .select("-pass")
      .lean();

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.status(200).json(admin);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update Admin
export const updateAdmin = async (req, res) => saveAdmin(req, res);
export const patchAdmin = async (req, res) => saveAdmin(req, res);

// Delete Admin
export const deleteAdmin = async (req, res) => {
  try {
    const admin = await Admin.findOneAndDelete({
      id: Number(req.params.id),
    }).lean();

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.status(200).json({ message: "Admin deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
