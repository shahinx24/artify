import {
  getDashboardStats,
} from "../../services/admin/dashboardService.js";

// Send Error Response
const sendError = (res, error) => {
  return res.status(
    error.statusCode || 500
  ).json({
    message:
      error.message ||
      "Something went wrong",
  });
};

// Get Admin Dashboard Stats
export const getAdminDashboardStats = async (
  req,
  res
) => {
  try {
    const stats = await getDashboardStats();

    return res.status(200).json(stats);

  } catch (error) {
    console.error(
      "getAdminDashboardStats error:",
      error
    );

    return sendError(res, error);
  }
};