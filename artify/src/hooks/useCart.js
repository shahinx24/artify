import { useEffect, useState } from "react";
import { ENV } from "../constants/env";

export default function useCart() {
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

  const addToCart = (productId) => {
    const updated = [...cart];
    const exist = updated.find(i => i.productId === productId);

    if (exist) {
      exist.qty += 1;
    } else {
      updated.push({ productId, qty: 1 });
    }
    saveCart(updated);
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
    clearCart
  };
}