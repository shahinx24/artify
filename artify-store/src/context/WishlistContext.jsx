import { createContext, useState, useEffect } from "react";

export const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem("wishlist");
    return saved ? JSON.parse(saved) : [];
  });
 // Save wishlist in localStorage
  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  function toggleWishlist(product) {
    setWishlist(prev => {
      if (prev.some(item => item.id === product.id)) {
        return prev.filter(item => item.id !== product.id);
      }
      return [...prev, product];
    });
  }

  function isWishlisted(id) {
    return wishlist.some(item => item.id === id);
  }

  const wishlistCount = wishlist.length;
  const displayWishlistCount = wishlistCount > 99 ? "99+" : wishlistCount;

  return (
    <WishlistContext.Provider value={{
      wishlist,
      toggleWishlist,
      isWishlisted,
      wishlistCount,
      displayWishlistCount
    }}>
      {children}
    </WishlistContext.Provider>
  );
}