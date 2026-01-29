import { api } from "./api";

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