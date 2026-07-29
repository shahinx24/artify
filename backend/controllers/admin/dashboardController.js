import { getDashboardStats } from "../../services/admin/dashboardService.js";

const sendError = (res, error) =>
  res.status(error.statusCode || 500).json({
    message: error.message || "Something went wrong",
  });

export const getAdminDashboardStats = async (req, res) => {
  try {
    const stats = await getDashboardStats();
    res.status(200).json(stats);
  } catch (error) {
    sendError(res, error);
  }
};