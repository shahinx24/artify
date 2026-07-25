export const toNumber = (value, fallback = undefined) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

export const normalizeEmail = (value = "") =>
  value.trim().toLowerCase();
