import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { saveUser } from "../services/userService";
import { getWishlistProducts } from "../services/productService";

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

    getWishlistProducts(wishlist)
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
    const updatedWishlist = wishlist.includes(productId)
      ? wishlist.filter(id => Number(id) !== Number(productId))
      : [...wishlist, productId];

    const updatedUser = { ...auth, wishlist: updatedWishlist };

    await saveUser(updatedUser);
    updateAuth(updatedUser);

    showToast?.(
      wishlist.includes(productId)
        ? "Removed from wishlist"
        : "Added to wishlist"
    );
  };

  // Remove from wishlist
  const removeFromWishlist = async (productId) => {
    const updatedUser = {
      ...auth,
      wishlist: wishlist.filter(
        id => Number(id) !== Number(productId)
      ),
    };

    await saveUser(updatedUser);
    updateAuth(updatedUser);
    showToast?.("Removed from wishlist");
  };

  // Move to cart
  const moveToCart = async (productId) => {
    const updatedCart = [...cart];
    const exist = updatedCart.find(
      i => Number(i.productId) === Number(productId)
    );

    if (exist) exist.qty += 1;
    else updatedCart.push({ productId, qty: 1 });

    const updatedUser = {
      ...auth,
      cart: updatedCart,
      wishlist: wishlist.filter(
        id => Number(id) !== Number(productId)
      ),
    };

    await saveUser(updatedUser);
    updateAuth(updatedUser);

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