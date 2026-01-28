import { useEffect, useState } from "react";
import { getUser, saveUser } from "../../utils/userHelpers";
import { Link, useNavigate } from "react-router-dom";
import "../style/cart.css"

export default function CartPage({ showToast }) {
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const auth = JSON.parse(localStorage.getItem("auth"));

  useEffect(() => {
    const u = getUser();
    if (u) {
      setUser({
        ...u,
        cart: u.cart || []
      });
    }

    fetch("http://localhost:3000/products")
      .then(res => res.json())
      .then(data => setProducts(data));
  }, []);

  if (!auth) {
    return (
      <div
        className="page-contents">
        <h2>Please login to view your cart</h2>
        <Link to="/" className="checkout-btn">Go Home</Link>
      </div>
    );
  }

  if (!user) return null;

  const cartItems = user.cart
    .map(item => {
      const product = products.find(
        p => Number(p.id) === Number(item.productId)
      );
      return product ? { ...product, qty: item.qty } : null;
    })
    .filter(Boolean);

  const updateUser = async (updated) => {
    await saveUser(updated);
    setUser(updated);
  };

  const increaseQty = (id) => {
    const updated = {
      ...user,
      cart: user.cart.map(item =>
        Number(item.productId) === Number(id)
          ? { ...item, qty: item.qty + 1 }
          : item
      )
    };
    updateUser(updated);
  };

  const decreaseQty = (id) => {
    const updated = {
      ...user,
      cart: user.cart.map(item =>
        Number(item.productId) === Number(id) && item.qty > 1
          ? { ...item, qty: item.qty - 1 }
          : item
      )
    };
    updateUser(updated);
  };

  const removeItem = (id) => {
    const updated = {
      ...user,
      cart: user.cart.filter(
        item => Number(item.productId) !== Number(id)
      )
    };
    updateUser(updated);
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
    if (cartItems.length === 0) return showToast("Cart is empty");
    navigate("/checkout");
  };

  if (cartItems.length === 0) {
    return (
      <div className="page-contents" >
        <h2>Your cart is empty 🛒</h2>
        <p>Add some art supplies to get started!</p>
        <Link
          to="/"
          className="checkout-btn" >
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
          style={{
            display: "block",
            marginTop: "1rem",
            textAlign: "center"
          }}
        >
          ← Continue Shopping
        </Link>
      </div>
    </div>
  );
}