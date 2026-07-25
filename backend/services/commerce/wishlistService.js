import Product from "../../models/Product.js";
import Wishlist from "../../models/Wishlist.js";
import { toNumber } from "../../utils/normalize.js";
import { addCartItem } from "./cartService.js";
import { getProductOrThrow, getUserOrThrow } from "./userProductGuards.js";

export const getWishlistProducts = async (userId) => {
  const numericUserId = toNumber(userId);
  await getUserOrThrow(numericUserId);

  const wishlist = await Wishlist.find({ userId: numericUserId }).lean();

  if (wishlist.length === 0) {
    return [];
  }

  return Product.find({
    id: { $in: wishlist.map((item) => Number(item.productId)) },
  }).lean();
};

export const toggleWishlistItem = async (userId, productId) => {
  const numericUserId = toNumber(userId);
  const numericProductId = toNumber(productId);

  await getProductOrThrow(numericProductId);
  await getUserOrThrow(numericUserId);

  const existingItem = await Wishlist.findOne({
    userId: numericUserId,
    productId: numericProductId,
  }).lean();

  if (existingItem) {
    await Wishlist.deleteOne({ _id: existingItem._id });
  } else {
    await Wishlist.create({
      userId: numericUserId,
      productId: numericProductId,
    });
  }

  return getWishlistProducts(numericUserId);
};

export const removeWishlistItem = async (userId, productId) => {
  const numericUserId = toNumber(userId);
  const numericProductId = toNumber(productId);
  await getUserOrThrow(numericUserId);

  await Wishlist.deleteOne({
    userId: numericUserId,
    productId: numericProductId,
  });

  return getWishlistProducts(numericUserId);
};

export const moveWishlistItemToCart = async (userId, productId) => {
  const numericUserId = toNumber(userId);
  const numericProductId = toNumber(productId);

  await addCartItem(numericUserId, numericProductId, 1);

  await Wishlist.deleteOne({
    userId: numericUserId,
    productId: numericProductId,
  });

  return getWishlistProducts(numericUserId);
};
