import { useEffect, useState } from "react";
import axios from "axios";
import { getUser, saveUser } from "../utils/userHelpers";
import { Link } from "react-router-dom";

export default function WishlistPage() {
  const [user, setUser] = useState(getUser());
  const [products, setProducts] = useState([]);

  if (!user) return <h2 style={{ textAlign: "center", marginTop: "8rem" }}>Please login to view your wishlist</h2>;

  useEffect(() => {
    axios.get("http://localhost:3000/products").then(res => setProducts(res.data));
  }, []);

  const remove = async (id) => {
    const updated = { ...user, wishlist: user.wishlist.filter(pid => pid !== id) };
    await saveUser(updated);
    setUser(updated);
  };

  const wished = products.filter(p => user.wishlist.includes(p.id));

  return (
    <div className="cart-page">
      <h1>Your Wishlist</h1>

      {wished.length === 0 ? (
        <p className="empty-cart">No items saved.</p>
      ) : (
        <div className="cart-list">
          {wished.map(item => (
            <div className="cart-item" key={item.id}>
              <h3>{item.name}</h3>
              <p className="price">₹{item.price}</p>

              <div className="btn-group">
                <Link to={`/products/${item.category}`}>
                  <button>View</button>
                </Link>

                <button className="remove-btn" onClick={() => remove(item.id)}>
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}