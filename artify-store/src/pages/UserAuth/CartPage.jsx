import { useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";

import useCart from "../../hooks/useCart";
import { getUser } from "../../utils/userHelpers";
import { ROUTES } from "../../constants/routes";

export default function CartPage({ showToast }) {
  const { cart, removeFromCart, updateQty } = useCart();
  const navigate = useNavigate();
  const user = getUser();

  /* ---------- GUARDS ---------- */
  useEffect(() => {
    if (!user) {
      navigate(ROUTES.HOME);
    }
  }, [user, navigate]);

  const total = useMemo(
    () => cart.reduce((acc, item) => acc + item.price * item.qty, 0),
    [cart]
  );

  const goToPayment = () => {
    if (!cart || cart.length === 0) {
      showToast?.("Cart is empty");
      return;
    }
    navigate("/checkout"); // or ROUTES.CHECKOUT if you have it
  };

  if (!user) {
    return (
      <div
        className="page-content"
        style={{ marginTop: "6rem", textAlign: "center" }}
      >
        <h2>Please login to view your cart</h2>
        <Link
          to={ROUTES.HOME}
          className="checkout-btn"
          style={{ display: "inline-block", marginTop: "1rem" }}
        >
          Go Home
        </Link>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-items">
        {cart.length === 0 && (
          <p style={{ paddingTop: "2rem", textAlign: "center" }}>
            Cart is Empty!
          </p>
        )}

        {cart.map((p) => (
          <div className="cart-item" key={p.id}>
            <img src={p.image} alt={p.title} />

            <div className="item-info">
              <h3>{p.title}</h3>
              <p>₹{p.price}</p>
            </div>

            <div className="qty-btns">
              <button
                onClick={() =>
                  updateQty(p.id, Math.max(1, p.qty - 1))
                }
              >
                -
              </button>

              <span>{p.qty}</span>

              <button
                onClick={() =>
                  updateQty(p.id, Math.min(p.stock, p.qty + 1))
                }
              >
                +
              </button>
            </div>

            <button
              className="remove-btn"
              onClick={() => {
                removeFromCart(p.id);
                showToast?.("Removed from cart");
              }}
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="cart-summary">
        <h2>Order Summary</h2>

        <div className="summary-line">
          <span>Total Items:</span>
          <span>{cart.length}</span>
        </div>

        <div className="summary-line">
          <span>Subtotal:</span>
          <span>₹{total}</span>
        </div>

        <div className="summary-line">
          <span>Delivery:</span>
          <span>₹0</span>
        </div>

        <hr style={{ margin: "1rem 0" }} />

        <div className="summary-line" style={{ fontWeight: "bold" }}>
          <span>Total:</span>
          <span>₹{total}</span>
        </div>

        <button className="checkout-btn" onClick={goToPayment}>
          Proceed to Checkout
        </button>

        <Link
          to={ROUTES.HOME}
          style={{ display: "block", marginTop: "1rem", textAlign: "center" }}
        >
          ← Continue Shopping
        </Link>
      </div>
    </div>
  );
}