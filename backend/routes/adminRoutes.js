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

const router = express.Router();

router.post("/", createAdmin);
router.post("/login", loginAdmin);

router.get("/", getAllAdmins);

router.get("/:id", getAdminById);

router.put("/:id", updateAdmin);
router.patch("/:id", patchAdmin);

router.delete("/:id", deleteAdmin);

export default router;
