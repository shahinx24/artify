import express from "express";
import { auth, authorizeSelf } from "../middleware/auth.js";

import {
  createUser,
  getUser,
  getUserById,
  loginUser,
  updateUser,
  patchUser,
  deleteUser,
} from "../controllers/userController.js";

const router = express.Router();

router.post("/login", loginUser);
router.post("/", createUser);

router.use(auth);

router.get("/", getUser);
router.get("/:id", authorizeSelf, getUserById);

router.put("/:id", authorizeSelf, updateUser);
router.patch("/:id", authorizeSelf, patchUser);
router.delete("/:id", authorizeSelf, deleteUser);

export default router;