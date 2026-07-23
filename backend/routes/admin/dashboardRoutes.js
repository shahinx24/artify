const express = require("express");
const router = express.Router();

const {
  getDashboardStats,
} = require("../controllers/admin/dashboardController");

const { verifyToken, authorizeRole } = require("../middleware/auth");

router.get(
  "/dashboard",
  verifyToken,
  authorizeRole("ADMIN"),
  getDashboardStats
);

module.exports = router;