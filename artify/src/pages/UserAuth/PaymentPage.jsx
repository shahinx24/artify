import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import useCart from "../../hooks/useCart";
import {
  cancelRazorpayPayment,
  createCheckout,
  getRazorpayConfig,
  verifyRazorpayPayment,
} from "../../services/checkout/checkoutService";
import { loadRazorpay } from "../../utils/loadRazorpay";
import "../style/payment.css";

const PAYMENT_METHODS = [
  {
    id: "razorpay_upi",
    title: "UPI",
    subtitle: "Pay with any UPI app through Razorpay.",
    icon: "UPI",
  },
  {
    id: "razorpay_card",
    title: "Card",
    subtitle: "Use credit or debit card with secure verification.",
    icon: "CARD",
  },
];

export default function PaymentPage({ showToast }) {
  const navigate = useNavigate();
  const { auth, updateAuth } = useAuth();
  const { cartItems, loading } = useCart();

  const [checkoutState, setCheckoutState] = useState({
    method: "razorpay_upi",
    address: {
      city: "",
      street: "",
      pin: "",
    },
    isSubmitting: false,
    checkoutRequestId: "",
    razorpayMethods: [],
  });

  const handleAddressChange = (field, value) => {
    setCheckoutState((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        [field]: value,
      },
    }));
  };

  const {
    method,
    address,
    isSubmitting,
    checkoutRequestId,
    razorpayMethods,
  } = checkoutState;

  useEffect(() => {
    if (!auth) {
      navigate("/login");
      return;
    }

    if (!auth.cart || auth.cart.length === 0) {
      navigate("/cart");
    }
  }, [auth, navigate]);

  useEffect(() => {
    if (!checkoutRequestId) {
      setCheckoutState((prev) => ({
        ...prev,
        checkoutRequestId:
          window.crypto?.randomUUID?.() ||
          `${Date.now()}-${Math.random()}`,
      }));
    }
  }, [checkoutRequestId]);

  getRazorpayConfig()
    .then(({ data }) =>
      setCheckoutState((prev) => ({
        ...prev,
        razorpayMethods: data.paymentMethods || [],
      }))
    )
    .catch(() =>
      setCheckoutState((prev) => ({
        ...prev,
        razorpayMethods: [],
      }))
    );

  if (!auth || !auth.cart || auth.cart.length === 0) {
    return (
      <div className="payment-page">
        <p className="payment-warning">Cart is empty. Add items first.</p>
      </div>
    );
  }

  const cartTotal = cartItems.reduce(
    (sum, item) => sum + Number(item.price) * item.qty,
    0
  );

  const cartCount = cartItems.reduce((sum, item) => sum + item.qty, 0);

  const placeOrder = async () => {
    let checkoutOrderId = null;
    let paymentResponseReceived = false;

    try {
      if (isSubmitting) return;
      if (!address.city || !address.street || !address.pin) {
        return showToast("Fill address");
      }

      setCheckoutState((prev) => ({
        ...prev,
        isSubmitting: true,
      }));

      const { data: checkout } = await createCheckout({
        userId: Number(auth.id),
        method,
        address,
        clientRequestId: checkoutRequestId,
      });
      checkoutOrderId = checkout.order?.id;

      if (checkout.user) {
        updateAuth(checkout.user);
      }

      if (!checkout.razorpayOrder) {
        throw new Error("Razorpay order was not created");
      }

      const scriptLoaded = await loadRazorpay();
      if (!scriptLoaded) {
        throw new Error("Failed to load Razorpay checkout");
      }

      const { data: razorpayConfig } = await getRazorpayConfig();
      const selectedMethod = (
        razorpayConfig.paymentMethods || razorpayMethods
      ).find((item) => item.id === method);
      const checkoutMethod = selectedMethod?.checkoutMethod;

      console.info("[checkout] opening Razorpay", {
        keyMode: razorpayConfig.mode,
        keyId: razorpayConfig.keyId?.replace(/^(.{8}).+(.{4})$/, "$1...$2"),
        selectedPaymentMethod: method,
        checkoutMethod,
        razorpayOrderId: checkout.razorpayOrder.id,
        amount: checkout.razorpayOrder.amount,
        currency: checkout.razorpayOrder.currency,
      });

      if (!razorpayConfig.keyId) {
        throw new Error("Razorpay key id was not returned by the backend");
      }

      if (!checkout.razorpayOrder.id || !checkout.razorpayOrder.amount) {
        throw new Error("Invalid Razorpay order returned by the backend");
      }

      await new Promise((resolve, reject) => {
        const razorpay = new window.Razorpay({
          key: razorpayConfig.keyId,
          amount: checkout.razorpayOrder.amount,
          currency: checkout.razorpayOrder.currency,
          name: "Artify",
          description: "Art supplies checkout",
          order_id: checkout.razorpayOrder.id,
          handler: async (response) => {
            try {
              paymentResponseReceived = true;
              console.info("[checkout] Razorpay payment authorized", {
                orderId: checkout.order.id,
                razorpayOrderId: response.razorpay_order_id,
                hasPaymentId: Boolean(response.razorpay_payment_id),
                hasSignature: Boolean(response.razorpay_signature),
                preferredMethod: checkoutMethod,
              });
              const { data } = await verifyRazorpayPayment({
                orderId: checkout.order.id,
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              });

              if (data.user) {
                updateAuth(data.user);
              }

              setCheckoutState((prev) => ({
                ...prev,
                checkoutRequestId: "",
              }));
              showToast("Payment successful. Order placed!");
              navigate("/");
              resolve();
            } catch (error) {
              reject(error);
            }
          },
          prefill: {
            email: auth.email,
          },
          notes: {
            userId: String(auth.id),
            selectedMethod: method,
          },
          theme: {
            color: "#0f766e",
          },
          modal: {
            ondismiss: () => reject(new Error("Payment was cancelled")),
          },
        });

        razorpay.on("payment.failed", (response) => {
          console.error("[checkout] Razorpay payment failed", {
            code: response?.error?.code,
            description: response?.error?.description,
            reason: response?.error?.reason,
            source: response?.error?.source,
            step: response?.error?.step,
            metadata: response?.error?.metadata,
          });
          reject(
            new Error(
              response?.error?.description ||
              response?.error?.reason ||
              "Payment failed"
            )
          );
        });

        razorpay.open();
      });
    } catch (error) {
      console.error("Order placement failed", error);
      if (checkoutOrderId && !paymentResponseReceived) {
        try {
          await cancelRazorpayPayment({
            orderId: checkoutOrderId,
            reason: error.message || "Checkout was not completed",
          });
        } catch (cancelError) {
          console.error("Failed to cancel pending Razorpay checkout", cancelError);
        }
      }

      showToast(error?.response?.data?.message || error.message || "Failed to place order");
    } finally {
      setCheckoutState((prev) => ({
        ...prev,
        isSubmitting: false,
      }));
    }
  };

  return (
    <div className="payment-page">
      <div className="payment-shell">
        <div className="payment-heading">
          <p>Secure Checkout</p>
          <h2>Pay for your Artify order</h2>
        </div>

        <div className="payment-container">
          <section className="pay-panel">
            <div className="panel-title">
              <span>1</span>
              <div>
                <h3>Payment method</h3>
                <p>Processed by Razorpay in test or live mode.</p>
              </div>
            </div>

            <div className="method-grid">
              {PAYMENT_METHODS.map((item) => (
                <label
                  className={`method-box ${method === item.id ? "active" : ""}`}
                  key={item.id}
                >
                  <input
                    type="radio"
                    name="pay"
                    checked={method === item.id}
                    onChange={() =>
                      setCheckoutState((prev) => ({
                        ...prev,
                        method: item.id,
                      }))
                    }
                  />
                  <span className="method-icon">{item.icon}</span>
                  <span>
                    <strong>{item.title}</strong>
                    <small>{item.subtitle}</small>
                  </span>
                </label>
              ))}
            </div>

            <div className="pay-summary">
              <div>
                <span>Items</span>
                <strong>{cartCount}</strong>
              </div>
              <div>
                <span>Total</span>
                <strong>Rs {cartTotal}</strong>
              </div>
              <div>
                <span>Status</span>
                <strong>Payment required</strong>
              </div>
            </div>
          </section>

          <section className="pay-panel">
            <div className="panel-title">
              <span>2</span>
              <div>
                <h3>Delivery address</h3>
                <p>Used for dispatching this order.</p>
              </div>
            </div>

            <input
              type="text"
              placeholder="City"
              value={address.city}
              onChange={(e) => handleAddressChange("city", e.target.value)}
            />

            <input
              type="text"
              placeholder="Street / Location"
              value={address.street}
              onChange={(e) => handleAddressChange("street", e.target.value)}
            />

            <input
              type="number"
              placeholder="PIN Code"
              value={address.pin}
              onChange={(e) => handleAddressChange("pin", e.target.value)}
            />

            <button
              className="place-btn"
              onClick={placeOrder}
              disabled={isSubmitting || loading}
            >
              {isSubmitting ? "Processing..." : `Pay Rs ${cartTotal}`}
            </button>

            <button className="cancel-btn" onClick={() => navigate("/cart")}>
              Cancel
            </button>
          </section>
        </div>
      </div>
    </div>
  );
}
