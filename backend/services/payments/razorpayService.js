import { RAZORPAY_PAYMENT_METHODS } from "./paymentMethods.js";

const RAZORPAY_API_BASE = "https://api.razorpay.com/v1";

const maskKey = (value = "") =>
  value.length > 8 ? `${value.slice(0, 8)}...${value.slice(-4)}` : "missing";

const getKeyMode = (keyId = "") => {
  if (keyId.startsWith("rzp_test_")) return "test";
  if (keyId.startsWith("rzp_live_")) return "live";
  return "unknown";
};

const getCredentials = () => {
  const keyId = process.env.RAZORPAY_KEY_ID?.trim();
  const keySecret = process.env.RAZORPAY_KEY_SECRET?.trim();

  if (!keyId || !keySecret) {
    const error = new Error("Razorpay is not configured");
    error.statusCode = 503;
    throw error;
  }

  const mode = getKeyMode(keyId);
  if (mode === "unknown") {
    const error = new Error("Invalid Razorpay key id format");
    error.statusCode = 503;
    throw error;
  }

  if (!keySecret || keySecret.length < 12) {
    const error = new Error("Invalid Razorpay key secret");
    error.statusCode = 503;
    throw error;
  }

  return { keyId, keySecret };
};

const buildAuthHeader = () => {
  const { keyId, keySecret } = getCredentials();
  return `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString("base64")}`;
};

export const getRazorpayPublicConfig = () => {
  const { keyId } = getCredentials();
  const mode = getKeyMode(keyId);

  console.info("[razorpay] public config requested", {
    keyId: maskKey(keyId),
    mode,
  });

  return {
    keyId,
    mode,
    paymentMethods: Object.entries(RAZORPAY_PAYMENT_METHODS).map(
      ([id, method]) => ({
        id,
        label: method.label,
        checkoutMethod: method.checkoutMethod,
      })
    ),
  };
};

export const createRazorpayOrder = async ({ amount, receipt, notes }) => {
  const { keyId } = getCredentials();
  const amountInPaise = Number(amount);

  if (!Number.isInteger(amountInPaise) || amountInPaise <= 0) {
    const error = new Error("Invalid Razorpay order amount");
    error.statusCode = 400;
    throw error;
  }

  console.info("[razorpay] creating order", {
    amount: amountInPaise,
    currency: "INR",
    receipt,
    keyId: maskKey(keyId),
    mode: getKeyMode(keyId),
    selectedMethod: notes?.selectedMethod,
  });

  const response = await fetch(`${RAZORPAY_API_BASE}/orders`, {
    method: "POST",
    headers: {
      Authorization: buildAuthHeader(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount: amountInPaise,
      currency: "INR",
      receipt,
      notes,
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    console.error("[razorpay] order creation failed", {
      status: response.status,
      description: data.error?.description,
      code: data.error?.code,
      field: data.error?.field,
    });

    const error = new Error(data.error?.description || "Failed to create Razorpay order");
    error.statusCode = response.status;
    throw error;
  }

  if (!data.id || data.amount !== amountInPaise || data.currency !== "INR") {
    console.error("[razorpay] order response mismatch", {
      razorpayOrderId: data.id,
      requestedAmount: amountInPaise,
      returnedAmount: data.amount,
      returnedCurrency: data.currency,
    });

    const error = new Error("Razorpay returned an invalid order");
    error.statusCode = 502;
    throw error;
  }

  console.info("[razorpay] order created", {
    razorpayOrderId: data.id,
    amount: data.amount,
    currency: data.currency,
    status: data.status,
  });

  return data;
};
