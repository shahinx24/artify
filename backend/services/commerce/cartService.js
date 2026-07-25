import Product from "../../models/Product.js";
import Cart from "../../models/Cart.js";
import { toNumber } from "../../utils/normalize.js";
import { getProductOrThrow, getUserOrThrow } from "./userProductGuards.js";

export const getCartDetails = async (userId) => {
  const numericUserId = toNumber(userId);

  await getUserOrThrow(numericUserId);

  const cart = await Cart.find({ userId: numericUserId }).lean();

  if (!cart.length) {
    return [];
  }

  const productIds = cart.map((item) => item.productId);

  const products = await Product.find({
    id: { $in: productIds },
  }).lean();

  const productMap = new Map(
    products.map((product) => [Number(product.id), product])
  );

  return cart
    .map((item) => {
      const product = productMap.get(Number(item.productId));

      if (!product) return null;

      return {
        ...product,
        productId: product.id,
        qty: item.qty,
      };
    })
    .filter(Boolean);
};

export const addCartItem = async (userId, productId, qty = 1) => {
  const numericUserId = toNumber(userId);
  const numericProductId = toNumber(productId);
  const incrementBy = Math.max(1, toNumber(qty, 1));

  await getUserOrThrow(numericUserId);
  await getProductOrThrow(numericProductId);

  await Cart.updateOne(
    {
      userId: numericUserId,
      productId: numericProductId,
    },
    {
      $inc: {
        qty: incrementBy,
      },
    },
    {
      upsert: true,
    }
  );

  return await getCartDetails(numericUserId);
};

export const updateCartItemQty = async (userId, productId, qty) => {
  const numericUserId = toNumber(userId);
  const numericProductId = toNumber(productId);
  const nextQty = Math.max(1, toNumber(qty, 1));

  await getUserOrThrow(numericUserId);

  const result = await Cart.updateOne(
    {
      userId: numericUserId,
      productId: numericProductId,
    },
    {
      $set: {
        qty: nextQty,
      },
    }
  );

  if (result.matchedCount === 0) {
    const error = new Error("Cart item not found");
    error.statusCode = 404;
    throw error;
  }

  return await getCartDetails(numericUserId);
};

export const removeCartItem = async (userId, productId) => {
  const numericUserId = toNumber(userId);
  const numericProductId = toNumber(productId);

  await getUserOrThrow(numericUserId);

  await Cart.deleteOne({
    userId: numericUserId,
    productId: numericProductId,
  });

  return await getCartDetails(numericUserId);
};

export const clearCart = async (userId) => {
  const numericUserId = toNumber(userId);

  await getUserOrThrow(numericUserId);

  await Cart.deleteMany({
    userId: numericUserId,
  });

  return [];
};
