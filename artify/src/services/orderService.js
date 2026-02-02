import api from "./api";

// Admin – all orders
export const getAllOrders = () => api.get("/orders");

// User – own orders
export const getOrders = (userId) =>
  api.get(`/orders?userId=${userId}`);

// Admin – view orders by user email
export const getOrdersByEmail = (email) =>
  api.get(`/orders?userEmail=${email}`);

// Update order status
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

  return { totalOrders, totalRevenue };
};