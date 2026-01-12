import { useContext } from "react";
import { WishlistContext } from "../context/WishlistContext.jsx";
import CartButton from "../components/CartButton.jsx";

export default function WishlistPage() {
  const { wishlist, toggleWishlist } = useContext(WishlistContext);

  return (
    <div className="page-content">
        <CartButton />
      <h1>Your Wishlist</h1>

      {wishlist.length === 0 && <p>No items yet ❤️</p>}

      <div className="product-grid">
        {wishlist.map(p => (
          <div className="product-card" key={p.id}>
            <img src={p.image} alt={p.name} />
            <h4>{p.name}</h4>
            <p>₹{p.price}</p>

            <button onClick={() => toggleWishlist(p)}>Remove</button>
          </div>
        ))}
      </div>
    </div>
  );
}