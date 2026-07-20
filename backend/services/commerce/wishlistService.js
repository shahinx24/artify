import Product from "../../models/Product.js";
import User from "../../models/User.js";
import { toNumber } from "../../utils/normalize.js";
import { addCartItem } from "./cartService.js";

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

export const getWishlistProducts = async (userId) => {
  const numericUserId = toNumber(userId);
  const user = await getUserOrThrow(numericUserId);
  const wishlist = user.wishlist || [];

  return Product.find({
    id: { $in: wishlist.map((item) => Number(item)) },
  }).lean();
};

export const toggleWishlistItem = async (userId, productId) => {
  const numericUserId = toNumber(userId);
  const numericProductId = toNumber(productId);

  await getProductOrThrow(numericProductId);
  const user = await getUserOrThrow(numericUserId);

  if ((user.wishlist || []).includes(numericProductId)) {
    user.wishlist = user.wishlist.filter((item) => Number(item) !== numericProductId);
  } else {
    user.wishlist.push(numericProductId);
  }

  await user.save();
  return user.toObject();
};

export const removeWishlistItem = async (userId, productId) => {
  const numericUserId = toNumber(userId);
  const numericProductId = toNumber(productId);
  const user = await getUserOrThrow(numericUserId);

  user.wishlist = (user.wishlist || []).filter(
    (item) => Number(item) !== numericProductId
  );

  await user.save();
  return user.toObject();
};

export const moveWishlistItemToCart = async (userId, productId) => {
  const numericUserId = toNumber(userId);
  const numericProductId = toNumber(productId);

  await addCartItem(numericUserId, numericProductId, 1);
  const user = await getUserOrThrow(numericUserId);
  user.wishlist = (user.wishlist || []).filter(
    (item) => Number(item) !== numericProductId
  );

  await user.save();
  return user.toObject();
};
