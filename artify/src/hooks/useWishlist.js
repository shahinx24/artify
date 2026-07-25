import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  getWishlistProducts,
  moveWishlistItemToCart,
  removeWishlistItem,
  toggleWishlistItem,
} from "../services/commerce/wishlistService";

export default function useWishlist(showToast) {
  const { auth, refreshKey, triggerRefresh } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load wishlist products
  useEffect(() => {
    let active = true;

    if (!auth?.id) {
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
  }, [auth?.id, refreshKey, showToast]);


  // Not logged in
  if (!auth) {
    return {
      wishlist: [],
      products: [],
      loading: false,
      isWishlisted: () => false,
      toggleWishlist: () => showToast?.("Login required"),
      removeFromWishlist: () => { },
      moveToCart: () => { },
    };
  }

  // Toggle wishlist
  const toggleWishlist = async (productId) => {
    if (auth.role === "admin") {
      showToast?.("Admins cannot use the wishlist");
      return;
    }

    const wasWishlisted = products.some(
      (item) => Number(item.id) === Number(productId)
    );
    const { data } = await toggleWishlistItem(auth.id, productId);
    setProducts(data);
    triggerRefresh();

    showToast?.(wasWishlisted ? "Removed from wishlist" : "Added to wishlist");
  };

  // Remove from wishlist
  const removeFromWishlist = async (productId) => {
    if (auth.role === "admin") {
      showToast?.("Admins cannot use the wishlist");
      return;
    }

    const { data } = await removeWishlistItem(auth.id, productId);
    setProducts(data);
    triggerRefresh();
    showToast?.("Removed from wishlist");
  };

  // Move to cart
  const moveToCart = async (productId) => {
    if (auth.role === "admin") {
      showToast?.("Admins cannot use the cart");
      return;
    }

    const { data } = await moveWishlistItemToCart(auth.id, productId);
    setProducts(data);
    triggerRefresh();

    showToast?.("Moved to cart");
  };

  const isWishlisted = (productId) =>
    products.some((item) => Number(item.id) === Number(productId));

  return {
    wishlist: products.map((item) => item.id),
    products,
    loading,
    isWishlisted,
    toggleWishlist,
    removeFromWishlist,
    moveToCart,
  };
}
