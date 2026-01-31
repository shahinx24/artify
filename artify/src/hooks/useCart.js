import { useEffect, useState } from "react";
import { ENV } from "../constants/env";
import { useAuth } from "../context/AuthContext";
import { saveUser } from "../services/userService";

export default function useCart() {
  const { auth, updateAuth } = useAuth();
  const [cart, setCart] = useState(() => {
    return JSON.parse(localStorage.getItem(ENV.CART_KEY)) || [];
  });

  // Sync across tabs
  useEffect(() => {
    const syncCart = () => {
      const stored = JSON.parse(localStorage.getItem(ENV.CART_KEY)) || [];
      setCart(stored);
    };
    window.addEventListener("storage", syncCart);
    return () => window.removeEventListener("storage", syncCart);
  }, []);

  const saveCart = (updated) => {
    localStorage.setItem(ENV.CART_KEY, JSON.stringify(updated));
    setCart(updated);
  };

  const addToCart = async (productId) => {
      if (!auth) throw new Error("Login required");

      const updatedUser = {
        ...auth,
        cart: auth.cart ? [...auth.cart] : [],
      };

      const exist = updatedUser.cart.find(
        i => Number(i.productId) === Number(productId)
      );

      if (exist) {
        exist.qty += 1;
      } else {
        updatedUser.cart.push({
          productId: Number(productId),
          qty: 1,
        });
      }

      await saveUser(updatedUser);   // backend
      updateAuth(updatedUser);       // context sync
    };

  const removeFromCart = (productId) => {
    saveCart(cart.filter(i => i.productId !== productId));
  };

  const updateQty = (productId, qty) => {
    const updated = cart.map(i =>
      i.productId === productId
        ? { ...i, qty: Math.max(1, qty) }
        : i
    );
    saveCart(updated);
  };

  const clearCart = () => {
    localStorage.removeItem(ENV.CART_KEY);
    setCart([]);
  };

  return {
    cart,
    addToCart,
    removeFromCart,
    updateQty,
  };
}