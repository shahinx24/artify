import { useEffect, useState, useCallback } from "react";
import { getCart, saveCart } from "../utils/cartHelpers";

export default function useCart() {
  const [cart, setCart] = useState(getCart());

  useEffect(() => {
    const syncCart = () => setCart(getCart());
    window.addEventListener("storage", syncCart);
    return () => window.removeEventListener("storage", syncCart);
  }, []);

  const addToCart = useCallback((product) => {
    setCart(prev => {
      const exists = prev.find(p => p.id === product.id);
      let updated;

      if (exists) {
        if (exists.qty >= product.stock) return prev;
        updated = prev.map(p =>
          p.id === product.id ? { ...p, qty: p.qty + 1 } : p
        );
      } else {
        updated = [...prev, { ...product, qty: 1 }];
      }

      saveCart(updated);
      return updated;
    });
  }, []);

  const removeFromCart = useCallback((id) => {
    setCart(prev => {
      const updated = prev.filter(p => p.id !== id);
      saveCart(updated);
      return updated;
    });
  }, []);

  const updateQty = useCallback((id, qty) => {
    setCart(prev => {
      const updated = prev.map(p =>
        p.id === id ? { ...p, qty } : p
      );
      saveCart(updated);
      return updated;
    });
  }, []);

  return { cart, addToCart, removeFromCart, updateQty };
}