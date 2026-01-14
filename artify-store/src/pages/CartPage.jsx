import { useEffect, useState } from "react";
import axios from "axios";
import { getUser, saveUser } from "../utils/userHelpers";

export default function CartPage({ showToast }) {
  const [user, setUser] = useState(getUser());

  if (!user) return <h2 style={{ textAlign: "center", marginTop: "8rem" }}>Please login to view your cart</h2>;

  const removeItem = async (id) => {
    const updated = { ...user, cart: user.cart.filter(item => item.id !== id) };
    await saveUser(updated);
    setUser(updated);
    return showToast("Item removed from cart");
  };

  const updateQty = async (id, change) => {
    const updated = { ...user };
    updated.cart = updated.cart.map(item =>
      item.id === id ? { ...item, qty: Math.max(1, item.qty + change) } : item
    );
    await saveUser(updated);
    setUser(updated);
  };

  const total = user.cart.reduce((sum, p) => sum + p.price * p.qty, 0);

  return (
    <div className="cart-page">
      <h1>Your Cart</h1>

      {user.cart.length === 0 ? (
        <p className="empty-cart">Your cart is empty.</p>
      ) : (
        <div className="cart-list">
          {user.cart.map(item => (
            <div className="cart-item" key={item.id}>
              <h3>{item.name}</h3>
              <p className="price">₹{item.price}</p>

              <div className="qty-box">
                <button onClick={() => updateQty(item.id, -1)}>-</button>
                <span>{item.qty}</span>
                <button onClick={() => updateQty(item.id, 1)}>+</button>
              </div>

              <button className="remove-btn" onClick={() => removeItem(item.id)}>
                Remove
              </button>
            </div>
          ))}
          <h2 className="cart-total">Total: ₹{total}</h2>
        </div>
      )}
    </div>
  );
}