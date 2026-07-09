import { cancelOrderById } from "../services/orderService";

export default function useCancelOrder(showToast) {
  const cancelOrder = async (order) => {
    try {
      await cancelOrderById(order.id);

      showToast?.("Order cancelled");
    } catch (err) {
      console.error("Cancel order failed", err);
      showToast?.("Failed to cancel order");
    }
  };

  return { cancelOrder };
}
