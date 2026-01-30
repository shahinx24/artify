import { api } from "./api";

export const getProducts = () => api.get("/products");
export const addProduct = (data) => api.post("/products", data);
export const updateProduct = (id, data) =>
  api.patch(`/products/${id}`, data);
export const deleteProduct = (id) =>
  api.delete(`/products/${id}`);
export const getWishlistProducts = async (wishlistIds) => {
  if (!wishlistIds?.length) return [];

  const { data } = await api.get("/products");

  return data.filter(p =>
    wishlistIds.some(id => Number(id) === Number(p.id))
  );
};
export const restoreStock = async (items) => {
  const { data: products } = await api.get("/products");

  for (const item of items) {
    const product = products.find(
      p => Number(p.id) === Number(item.productId)
    );

    if (!product) continue;

    await api.patch(`/products/${product.id}`, {
      stock: Number(product.stock) + Number(item.qty)
    });
  }
};
export const getProductCount = async () => {
  const { data } = await api.get("/products");
  return data.length;
};