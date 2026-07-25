import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  addCartItem as addCartItemRequest,
  getCartItems,
  removeCartItem as removeCartItemRequest,
  updateCartItemQty,
} from "../services/commerce/cartService";

export default function useCart() {
  const { auth, refreshKey, triggerRefresh } = useAuth();
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
  }, [auth?.id, refreshKey]);

  const addToCart = async (productId) => {
    if (!auth) throw new Error("Login required");

    if (auth.role === "admin") {
      throw new Error("Admins cannot add items to the cart.");
    }

    const { data } = await addCartItemRequest(auth.id, productId, 1);
    setCartItems(data);
    triggerRefresh();
  };

  const removeFromCart = async (productId) => {
    if (!auth) throw new Error("Login required");

    const { data } = await removeCartItemRequest(auth.id, productId);
    setCartItems(data);
    triggerRefresh();
  };

  const updateQty = async (productId, qty) => {
    if (!auth) throw new Error("Login required");

    const { data } = await updateCartItemQty(auth.id, productId, qty);
    setCartItems(data);
    triggerRefresh();
  };

  return {
    cart: cartItems.map((item) => ({
      productId: item.productId ?? item.id,
      qty: item.qty,
    })),
    cartItems,
    loading,
    addToCart,
    removeFromCart,
    updateQty,
  };
}
