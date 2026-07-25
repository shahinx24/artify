import Product from "../../models/Product.js";
import User from "../../models/User.js";

const notFound = (message) => {
  const error = new Error(message);
  error.statusCode = 404;
  return error;
};

export const getUserOrThrow = async (userId) => {
  const user = await User.findOne({ id: userId }).lean();
  if (!user) throw notFound("User not found");
  return user;
};

export const getProductOrThrow = async (productId) => {
  const product = await Product.findOne({ id: productId }).lean();
  if (!product) throw notFound("Product not found");
  return product;
};
