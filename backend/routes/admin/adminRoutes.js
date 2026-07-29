import express from "express";
import { auth, authorizeRole } from "../middleware/auth.js";
import { dashboardStats } from "../controllers/dashboardController.js";

const router = express.Router();

router.use(auth);
router.use(authorizeRole("admin"));

router.get("/dashboard", dashboardStats);

export default router;