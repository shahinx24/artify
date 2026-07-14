import Admin from "../models/Admin.js";

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
    const admin = await Admin.create({
      ...req.body,
      id: req.body.id || (await nextNumericId()),
      email: req.body.email?.trim().toLowerCase(),
    });

    res.status(201).json(admin);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const loginAdmin = async (req, res) => {
  try {
    const email = req.body.email?.trim().toLowerCase();
    const pass = req.body.pass;

    const admin = await Admin.findOne({ email, pass }).lean();

    if (!admin) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.status(200).json(admin);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Admins
export const getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.find().lean();
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
    }).lean();

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

    const admin = await Admin.findOneAndUpdate(
      { id: Number(req.params.id) },
      payload,
      {
        new: true,
        runValidators: true,
      }
    ).lean();

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
