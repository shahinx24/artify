import api from "./api";

export const getProducts = () => api.get("/products");

export const getProductCount = async () => {
  const { data } = await api.get("/products");
  return data.length;
};

const sanitizeProduct = (data) => ({
  ...data,
  stock: Number(data.stock ?? 0),
  price: Number(data.price ?? 0),
});

export const addProduct = async (data) => {
  // get all products
  const { data: products } = await api.get("/products");

  // find max numeric id (ignore bad ones safely)
  const maxId = products.length
    ? Math.max(
        ...products
          .map(p => Number(p.id))
          .filter(id => Number.isFinite(id))
      )
    : 0;

  // create next id as STRING NUMBER
  const newProduct = {
    ...sanitizeProduct(data),
    id: String(maxId + 1),
  };

  // save
  return api.post("/products", newProduct);
};

export const updateProduct = (id, data) =>
  api.patch(`/products/${id}`, sanitizeProduct(data));

export const deleteProduct = (id) =>
  api.delete(`/products/${id}`);
