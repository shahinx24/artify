import { useAuth } from "../context/AuthContext";
import { saveUser } from "../services/userService";

export default function useWishlist(showToast) {
  const { auth, updateAuth } = useAuth();

  const wishlist = auth?.wishlist || [];
  const cart = auth?.cart || [];

  if (!auth) {
    return {
      wishlist: [],
      isWishlisted: () => false,
      toggleWishlist: () => {
        showToast?.("Login required");
      },
      removeFromWishlist: () => {},
      moveToCart: () => {},
    };
  }

  // ❤️ Toggle wishlist (ProductPage)
  const toggleWishlist = async (productId) => {
    const updatedWishlist = wishlist.includes(productId)
      ? wishlist.filter(id => Number(id) !== Number(productId))
      : [...wishlist, productId];

    const updatedUser = {
      ...auth,
      wishlist: updatedWishlist,
    };

    await saveUser(updatedUser);
    updateAuth(updatedUser);

    showToast?.(
      wishlist.includes(productId)
        ? "Removed from wishlist"
        : "Added to wishlist"
    );
  };

  // ❌ Remove only
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

  // 🔁 Move wishlist → cart (ATOMIC)
  const moveToCart = async (productId) => {
    const updatedCart = [...cart];
    const exist = updatedCart.find(
      i => Number(i.productId) === Number(productId)
    );

    if (exist) {
      exist.qty += 1;
    } else {
      updatedCart.push({ productId, qty: 1 });
    }

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
    isWishlisted,
    toggleWishlist,
    removeFromWishlist,
    moveToCart,
  };
}