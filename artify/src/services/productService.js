import api from "./api";

// Get all products
export const getProducts = () => api.get("/products");

// Get total product count
export const getProductCount = async () => {
  const { data } = await api.get("/products");
  return data.length;
};

// Add new product (with image)
export const addProduct = (formData) => {
  return api.post("/products", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const updateProduct = (id, data) => {
  const formData = new FormData();

  formData.append("name", data.name);
  formData.append("price", Number(data.price));
  formData.append("stock", Number(data.stock));

  if (data.image) {
    formData.append("image", data.image);
  }

  return api.patch(`/products/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// Delete product
export const deleteProduct = (id) =>
  api.delete(`/products/${id}`);