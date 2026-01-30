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
export const getProductCount = async () => {
  const { data } = await api.get("/products");
  return data.length;
};
export const restoreStock = async (items) => {
  const { data: products } = await api.get("/products");

  for (const item of items) {
    const product = products.find(
      p => Number(p.id) === Number(item.productId)
    );

    if (!product) continue;

    const currentStock = Number(product.stock ?? 0);

    await api.patch(`/products/${product.id}`, {
      stock: currentStock + Number(item.quantity),
    });
  }
};

export const reduceStock = async (items) => {
  const { data: products } = await api.get("/products");

  for (const item of items) {
    const product = products.find(
      p => Number(p.id) === Number(item.productId)
    );

    if (!product) continue;

    const currentStock = Number(product.stock ?? 0);

    await api.patch(`/products/${product.id}`, {
      stock: Math.max(0, currentStock - Number(item.quantity)),
    });
  }
};
