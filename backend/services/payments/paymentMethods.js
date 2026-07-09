export const RAZORPAY_PAYMENT_METHODS = {
  razorpay_upi: {
    label: "UPI",
    checkoutMethod: "upi",
  },
  razorpay_card: {
    label: "Card",
    checkoutMethod: "card",
  },
};

export const RAZORPAY_METHOD_IDS = Object.keys(RAZORPAY_PAYMENT_METHODS);

export const isRazorpayPaymentMethod = (method) =>
  RAZORPAY_METHOD_IDS.includes(method);

export const getRazorpayCheckoutMethod = (method) =>
  RAZORPAY_PAYMENT_METHODS[method]?.checkoutMethod;
