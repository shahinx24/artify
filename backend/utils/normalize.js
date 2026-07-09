export const toNumber = (value, fallback = undefined) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

export const normalizeEmail = (value = "") =>
  value.trim().toLowerCase();

export const normalizeCartItem = (item = {}) => ({
  productId: toNumber(item.productId),
  qty: Math.max(1, toNumber(item.qty, 1)),
});

export const normalizeWishlistItem = (value) => toNumber(value);
