import { useEffect, useState } from "react";
import { getUser, saveUser } from "../utils/userHelpers";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function CartPage({ showToast }) {
  const [user, setUser] = useState(getUser());
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const goToPayment = () => {
    if (cart.length === 0) return showToast("Cart is empty");
    navigate("/payment");
  };


  useEffect(() => {
    if (user) setProducts(user.cart);
  }, [user]);

  const updateUser = async (updated) => {
    await saveUser(updated);
    setUser(updated);
    setProducts(updated.cart);
  };

  const increaseQty = (id) => {
    const updated = { ...user };
    const item = updated.cart.find(p => p.id === id);
    item.qty++;
    updateUser(updated);
  };

  const decreaseQty = (id) => {
    const updated = { ...user };
    const item = updated.cart.find(p => p.id === id);
    if (item.qty > 1) item.qty--;
    updateUser(updated);
  };

  const removeItem = (id) => {
    const updated = { ...user };
    updated.cart = updated.cart.filter(p => p.id !== id);
    updateUser(updated);
    showToast("Removed from cart");
  };

  const total = products.reduce((acc, item) => acc + item.price * item.qty, 0);

  if (!user) {
    return (
      <div className="page-content" style={{ marginTop: "6rem", textAlign: "center" }}>
        <h2>Please login to view your cart</h2>
        <Link to="/" className="checkout-btn" style={{ display: "inline-block", marginTop: "1rem" }}>
          Go Home
        </Link>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-items">
        {products.length === 0 && (
          <p style={{ paddingTop: "2rem", textAlign: "center" }}>Cart is Empty!</p>
        )}

        {products.map(p => (
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

            <button className="remove-btn" onClick={() => removeItem(p.id)}>
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="cart-summary">
        <h2>Order Summary</h2>
        <div className="summary-line">
          <span>Total Items:</span>
          <span>{products.length}</span>
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

        <button className="checkout-btn" onClick={() => navigate("/checkout")}>
          Proceed to Checkout
        </button>
        <Link to="/" style={{ display: "block", marginTop: "1rem", textAlign: "center" }}>
          ← Continue Shopping
        </Link>
      </div>
    </div>
  );
}