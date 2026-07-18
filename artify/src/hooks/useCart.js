import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  addCartItem as addCartItemRequest,
  getCartItems,
  removeCartItem as removeCartItemRequest,
  updateCartItemQty,
} from "../services/commerce/cartService";

export default function useCart() {
  const { auth, updateAuth } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;

    if (!auth?.id) {
      setCartItems([]);
      return;
    }

    setLoading(true);
    getCartItems(auth.id)
      .then(({ data }) => {
        if (active) {
          setCartItems(data);
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [auth?.id, auth?.cart]);

  const addToCart = async (productId) => {
    if (!auth) throw new Error("Login required");

    if (auth.role === "admin") {
      throw new Error("Admins cannot add items to the cart.");
    }

    const { data } = await addCartItemRequest(auth.id, productId, 1);
    console.log("Cart response:", data);
    updateAuth(data);
  };

  const removeFromCart = async (productId) => {
    if (!auth) throw new Error("Login required");

    const { data } = await removeCartItemRequest(auth.id, productId);
    updateAuth(data);
  };

  const updateQty = async (productId, qty) => {
    if (!auth) throw new Error("Login required");

    const { data } = await updateCartItemQty(auth.id, productId, qty);
    updateAuth(data);
  };

  return {
    cart: auth?.cart || [],
    cartItems,
    loading,
    addToCart,
    removeFromCart,
    updateQty,
  };
}
