import api from "./api";

export const getProducts = () => api.get("/products");
export const getWishlistProducts = async (wishlistIds) => {
  if (!wishlistIds?.length) return { data: [] };

  const query = wishlistIds.map(id => `id=${id}`).join("&");
  return api.get(`/products?${query}`);
};
export const getProductCount = async () => {
  const { data } = await api.get("/products");
  return data.length;
};

export const reduceStock = async (items) => {
  for (const item of items) {

    if (!item?.productId) continue;

    const qty = Number(item.qty); 
    if (!Number.isFinite(qty)) continue;

    const { data: product } = await api.get(
      `/products/${item.productId}`
    );

    if (!product?.id) continue;

    const currentStock = Number(product.stock ?? 0);

    await api.patch(`/products/${product.id}`, {
      stock: Math.max(0, currentStock - qty),
    });
  }
};

export const restoreStock = async (items) => {
  for (const item of items) {

    if (!item?.productId) continue;

    const qty = Number(item.qty);
    if (!Number.isFinite(qty)) continue;

    const { data: product } = await api.get(
      `/products/${item.productId}`
    );

    if (!product?.id) continue;

    const currentStock = Number(product.stock ?? 0);

    await api.patch(`/products/${product.id}`, {
      stock: currentStock + qty,
    });
  }
};

const sanitizeProduct = (data) => ({
  ...data,
  stock: Number(data.stock ?? 0),
  price: Number(data.price ?? 0),
});

export const addProduct = (data) =>
  api.post("/products", sanitizeProduct(data));

export const updateProduct = (id, data) =>
  api.patch(`/products/${id}`, sanitizeProduct(data));

export const deleteProduct = (id) =>
  api.delete(`/products/${id}`);