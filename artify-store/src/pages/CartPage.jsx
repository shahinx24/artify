import { useContext } from "react";
import { CartContext } from "../context/CartContext.jsx";

export default function CartPage() {
  const { cart, increase, decrease, removeFromCart, total } = useContext(CartContext);

  return (
    <div className="cart-page">
      <h1>Your Cart</h1>
      
      {cart.length === 0 && <p className="empty-cart">Your cart is empty.</p>}

      <div className="cart-list">
        {cart.map(item => (
          <div key={item.id} className="cart-item">
            <h3>{item.name}</h3>
            <p className="price">₹{item.price}</p>

            <div className="qty-box">
              <button onClick={() => decrease(item.id)}>-</button>
              <span>{item.qty}</span>
              <button onClick={() => increase(item.id)}>+</button>
            </div>

            <button className="remove-btn" onClick={() => removeFromCart(item.id)}>
              Remove
            </button>
          </div>
        ))}
      </div>

      {cart.length > 0 && (
        <h2 className="cart-total">Total: ₹{total}</h2>
      )}
    </div>
  );
}