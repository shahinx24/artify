import api from "./api";

export const getOrders = () => {
  return api.get("/orders");
};

export const updateOrderStatus = (id, status) => {
  return api.patch(`/orders/${id}`, { status });
};
export const cancelOrderById = (orderId) => {
  return api.patch(`/orders/${orderId}`, {
    status: "cancelled"
  });
};
export const getOrderStats = async () => {
  const { data } = await api.get("/orders");

  const totalOrders = data.length;
  const totalRevenue = data.reduce(
    (sum, o) => sum + Number(o.total || 0),
    0
  );

  return {
    totalOrders,
    totalRevenue
  };
};