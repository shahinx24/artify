import api from "../services/api";

export default function usePayment(showToast) {
    const restoreStockAfterCancel = async (order) => {
      const res = await api.get("/products");
      const products = res.data;

      for (const item of order.items) {
        const product = products.find(
          p => Number(p.id) === Number(item.productId)
        );

        if (!product) continue;

        const updatedProduct = {
          ...product,
          stock: Number(product.stock) + Number(item.qty)
        };

        // JSON-server requires FULL object for PUT
        await api.put(`/products/${product.id}`, updatedProduct);

        console.log("Stock restored:", updatedProduct);
      }
    };

  const cancelOrder = async (order) => {
    await restoreStockAfterCancel(order);

    await api.patch(`/orders/${order.id}`, {
      status: "cancelled"
    });

    showToast?.("Order cancelled & stock restored");
  };

  return {
    cancelOrder,
    restoreStockAfterCancel
  };
}