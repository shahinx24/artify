import { Link, useNavigate } from "react-router-dom";
import "../style/cart.css";
import useCart from "../../hooks/useCart";
import { useAuth } from "../../context/AuthContext";

export default function CartPage({ showToast }) {
  const navigate = useNavigate();
  const { auth } = useAuth();
  const { cart, cartItems, loading, removeFromCart, updateQty } = useCart();

  //  Login guard
  if (!auth) {
    return (
      <div className="page-contents">
        <h2>Please login to view your cart</h2>
        <Link to="/" className="checkout-btn">Go Home</Link>
      </div>
    );
  }

  const increaseQty = async (id) => {
    const currentItem = cart.find(
      item => Number(item.productId) === Number(id)
    );
    if (!currentItem) return;
    await updateQty(id, currentItem.qty + 1);
  };

  const decreaseQty = async (id) => {
    const currentItem = cart.find(
      item => Number(item.productId) === Number(id)
    );
    if (!currentItem || currentItem.qty <= 1) return;
    await updateQty(id, currentItem.qty - 1);
  };

  const removeItem = async (id) => {
    await removeFromCart(id);
    showToast("Removed from cart");
  };

  const total = cartItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );

  const totalQty = cartItems.reduce(
    (acc, item) => acc + item.qty,
    0
  );

  const goToPayment = () => {
    if (cartItems.length === 0)
      return showToast("Cart is empty");
    navigate("/checkout");
  };

  if (loading) {
    return (
      <div className="page-contents">
        <h2>Loading cart...</h2>
      </div>
    );
  }

  // 🛒 Empty cart
  if (cartItems.length === 0) {
    return (
      <div className="page-contents">
        <h2>Your cart is empty 🛒</h2>
        <p>Add some art supplies to get started!</p>
        <Link to="/" className="checkout-btn">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-items">
        {cartItems.map(p => (
          <div className="cart-item" key={p.id}>
            <img src={p.image} alt={p.name} />

            <div className="item-info">
              <h3>{p.name}</h3>
              <p>₹{p.price}</p>
            </div>

            <div className="qty-btns">
              <button onClick={() => decreaseQty(p.id)}>-</button>
              <span>{p.qty}</span>
              <button onClick={() => increaseQty(p.id)}>+</button>
            </div>

            <button
              className="remove-btn"
              onClick={() => removeItem(p.id)}
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
          <span>{cartItems.length}</span>
        </div>

        <div className="summary-line">
          <span>Total Quantity:</span>
          <span>{totalQty}</span>
        </div>

        <div className="summary-line">
          <span>Subtotal:</span>
          <span>₹{total}</span>
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
          to="/"
          style={{ display: "block", marginTop: "1rem", textAlign: "center" }}
        >
          ← Continue Shopping
        </Link>
      </div>
    </div>
  );
}
