import express from "express";

import {
  createAdmin,
  getAllAdmins,
  getAdminById,
  loginAdmin,
  updateAdmin,
  patchAdmin,
  deleteAdmin,
} from "../controllers/adminController.js";

import { auth, authorizeRole, authorizeSelf } from "../middleware/auth.js";

const router = express.Router();

// Public
router.post("/login", loginAdmin);

// Protected (Admin Only)
router.post("/", createAdmin);

router.get("/", auth, authorizeRole("admin"), getAllAdmins);

router.get("/:id", auth, authorizeRole("admin"), getAdminById);

router.put("/:id", auth, authorizeSelf, updateAdmin);

router.patch("/:id", auth, authorizeSelf, patchAdmin);

router.delete("/:id", auth, authorizeRole("admin"), deleteAdmin);

export default router;