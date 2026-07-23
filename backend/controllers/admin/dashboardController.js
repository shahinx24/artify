const User = require("../../models/User");
const Product = require("../../models/Product");
const Order = require("../../models/Order");

// GET /api/admin/dashboard
exports.getDashboardStats = async (req, res) => {
  try {
    const [users, products, orders] = await Promise.all([
      User.countDocuments(),
      Product.countDocuments(),
      Order.find()
    ]);

    const totalOrders = orders.length;

    const totalRevenue = orders
      .filter(order => order.status !== "CANCELLED")
      .reduce((sum, order) => sum + Number(order.total || 0), 0);

    res.status(200).json({
      success: true,
      stats: {
        users,
        products,
        totalOrders,
        totalRevenue
      }
    });
  } catch (error) {
    console.error("Dashboard Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load dashboard statistics"
    });
  }
};