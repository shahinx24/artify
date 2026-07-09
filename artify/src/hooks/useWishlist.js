import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  getWishlistProducts,
  moveWishlistItemToCart,
  removeWishlistItem,
  toggleWishlistItem,
} from "../services/commerce/wishlistService";

export default function useWishlist(showToast) {
  const { auth, updateAuth } = useAuth();
  const wishlist = auth?.wishlist || [];
  const cart = auth?.cart || [];

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load wishlist products
  useEffect(() => {
    let active = true;

    if (!auth?.id || wishlist.length === 0) {
      setProducts([]);
      return;
    }

    setLoading(true);

    getWishlistProducts(auth.id)
      .then(res => active && setProducts(res.data))
      .catch(() => active && showToast?.("Failed to load wishlist"))
      .finally(() => active && setLoading(false));

    return () => {
      active = false;
    };
  }, [auth?.id, wishlist.join(",")]);


  // Not logged in
  if (!auth) {
    return {
      wishlist: [],
      products: [],
      loading: false,
      isWishlisted: () => false,
      toggleWishlist: () => showToast?.("Login required"),
      removeFromWishlist: () => {},
      moveToCart: () => {},
    };
  }

  // Toggle wishlist
  const toggleWishlist = async (productId) => {
    const { data } = await toggleWishlistItem(auth.id, productId);
    updateAuth(data);

    showToast?.(
      wishlist.includes(productId)
        ? "Removed from wishlist"
        : "Added to wishlist"
    );
  };

  // Remove from wishlist
  const removeFromWishlist = async (productId) => {
    const { data } = await removeWishlistItem(auth.id, productId);
    updateAuth(data);
    showToast?.("Removed from wishlist");
  };

  // Move to cart
  const moveToCart = async (productId) => {
    const { data } = await moveWishlistItemToCart(auth.id, productId);
    updateAuth(data);

    showToast?.("Moved to cart");
  };

  const isWishlisted = (productId) =>
    wishlist.includes(productId);

  return {
    wishlist,
    products,
    loading,
    isWishlisted,
    toggleWishlist,
    removeFromWishlist,
    moveToCart,
  };
}
