import { restoreStock } from "../services/productService";
import { cancelOrderById } from "../services/orderService";

export default function usePayment(showToast) {

  const cancelOrder = async (order) => {
    try {
      await restoreStock(order.items);
      await cancelOrderById(order.id);

      showToast?.("Order cancelled");
    } catch (err) {
      console.error("Cancel order failed", err);
      showToast?.("Failed to cancel order");
    }
  };

  return {
    cancelOrder
  };
}