import { useContext } from "react";
import { CartContext } from "../context/CartContext.jsx";

export default function CartPage() {
  const { cart, increase, decrease, removeFromCart, total } = useContext(CartContext);

  return (
    <div>
      <h1>Your Cart</h1>

      {cart.length === 0 && <p>No items in cart</p>}

      {cart.map(item => (
        <div key={item.id} style={{ marginBottom: "20px" }}>
          <h3>{item.name}</h3>
          <p>₹{item.price}</p>

          <button onClick={() => decrease(item.id)}>-</button>
          <span style={{ margin: "0 10px" }}>{item.qty}</span>
          <button onClick={() => increase(item.id)}>+</button>

          <button style={{ marginLeft: "10px", color: "red" }}
            onClick={() => removeFromCart(item.id)}>
            Remove
          </button>
        </div>
      ))}

      {cart.length > 0 && (
        <h2>Total: ₹{total}</h2>
      )}
    </div>
  );
}