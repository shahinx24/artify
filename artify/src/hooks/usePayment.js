import { ENV } from "../constants/env";

export default function usePayment(showToast) {
  const restoreStockAfterCancel = async (order) => {
    const res = await fetch(`${ENV.API_BASE_URL}/products`);
    const products = await res.json();

    for (const item of order.items) {
        const product = products.find(
        p => String(p.id) === String(item.productId)
        );

        if (!product) {
        console.error("Product not found for item:", item);
        continue;
        }

        const updatedProduct = {
        ...product,
        stock: Number(product.stock) + Number(item.qty)
        };

        await fetch(`${ENV.API_BASE_URL}/products/${product.id}`, {
        method: "PUT", // JSON-server requires FULL object
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedProduct)
        });

        console.log("Stock restored:", updatedProduct);
    }
    };


  const cancelOrder = async (order) => {
    await restoreStockAfterCancel(order);

    await fetch(`${ENV.API_BASE_URL}/orders/${order.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "cancelled" })
    });

    showToast?.("Order cancelled & stock restored");
  };

  return {
    cancelOrder,
    restoreStockAfterCancel
  };
}