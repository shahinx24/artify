import api from "./api";

export const getAllOrders = () => api.get("/orders");
// User orders
export const getOrders = (userId) =>
  api.get(`/orders?userId=${userId}`);

// Update order status (admin / user)
export const updateOrderStatus = (id, status) =>
  api.patch(`/orders/${id}`, { status });

// Cancel order
export const cancelOrderById = (orderId) =>
  api.patch(`/orders/${orderId}`, {
    status: "cancelled",
  });

// Admin dashboard stats
export const getOrderStats = async () => {
  const { data } = await api.get("/orders");

  const totalOrders = data.length;
  const totalRevenue = data.reduce(
    (sum, o) => sum + Number(o.total || 0),
    0
  );

  return {
    totalOrders,
    totalRevenue,
  };
};
