import Order from "../../models/Order.js";
import Product from "../../models/Product.js";
import User from "../../models/User.js";

export const getDashboardStats = async () => {
  const [users, products, totalOrders, revenue] = await Promise.all([
    User.countDocuments(),
    Product.countDocuments(),
    Order.countDocuments(),
    Order.aggregate([
      { $match: { status: "delivered" } },
      { $group: { _id: null, totalRevenue: { $sum: "$total" } } },
    ]),
  ]);

  return {
    users,
    products,
    totalOrders,
    totalRevenue: revenue[0]?.totalRevenue ?? 0,
  };
};
