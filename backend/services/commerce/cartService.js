import Product from "../../models/Product.js";
import User from "../../models/User.js";
import { normalizeCartItem, toNumber } from "../../utils/normalize.js";

const getUserOrThrow = async (userId) => {
  const user = await User.findOne({ id: userId });
  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  return user;
};

const getProductOrThrow = async (productId) => {
  const product = await Product.findOne({ id: productId }).lean();
  if (!product) {
    const error = new Error("Product not found");
    error.statusCode = 404;
    throw error;
  }

  return product;
};

export const getCartDetails = async (userId) => {
  const user = await getUserOrThrow(userId);
  const cart = user.cart || [];

  if (cart.length === 0) {
    return [];
  }

  const productIds = cart.map((item) => item.productId);
  const products = await Product.find({ id: { $in: productIds } }).lean();
  const productMap = new Map(products.map((product) => [Number(product.id), product]));

  return cart
    .map((item) => {
      const product = productMap.get(Number(item.productId));
      if (!product) return null;

      return {
        ...product,
        qty: Number(item.qty),
      };
    })
    .filter(Boolean);
};

export const addCartItem = async (userId, productId, qty = 1) => {
  const numericUserId = toNumber(userId);
  const numericProductId = toNumber(productId);
  const incrementBy = Math.max(1, toNumber(qty, 1));

  await getProductOrThrow(numericProductId);
  const user = await getUserOrThrow(numericUserId);

  const existingItem = user.cart.find(
    (item) => Number(item.productId) === numericProductId
  );

  if (existingItem) {
    existingItem.qty += incrementBy;
  } else {
    user.cart.push({
      productId: numericProductId,
      qty: incrementBy,
    });
  }

  await user.save();
  return user.toObject();
};

export const updateCartItemQty = async (userId, productId, qty) => {
  const numericUserId = toNumber(userId);
  const numericProductId = toNumber(productId);
  const nextQty = Math.max(1, toNumber(qty, 1));

  const user = await getUserOrThrow(numericUserId);
  user.cart = (user.cart || []).map((item) =>
    Number(item.productId) === numericProductId
      ? normalizeCartItem({ ...item.toObject?.(), ...item, qty: nextQty })
      : normalizeCartItem(item)
  );

  await user.save();
  return user.toObject();
};

export const removeCartItem = async (userId, productId) => {
  const numericUserId = toNumber(userId);
  const numericProductId = toNumber(productId);

  const user = await getUserOrThrow(numericUserId);
  user.cart = (user.cart || []).filter(
    (item) => Number(item.productId) !== numericProductId
  );

  await user.save();
  return user.toObject();
};

export const clearCart = async (userId) => {
  const numericUserId = toNumber(userId);
  const user = await getUserOrThrow(numericUserId);
  user.cart = [];
  await user.save();
  return user.toObject();
};
