import { useEffect, useState } from "react";
import { ENV } from "../constants/env";

export default function useCart() {
  const [cart, setCart] = useState(() => {
    return JSON.parse(localStorage.getItem(ENV.CART_KEY)) || [];
  });

  // Sync across tabs & components
  useEffect(() => {
    const syncCart = () => {
      const stored = JSON.parse(localStorage.getItem(ENV.CART_KEY)) || [];
      setCart(stored);
    };

    window.addEventListener("storage", syncCart);
    return () => window.removeEventListener("storage", syncCart);
  }, []);

  // Save helper
  const saveCart = (updatedCart) => {
    localStorage.setItem(ENV.CART_KEY, JSON.stringify(updatedCart));
    setCart(updatedCart);
  };

  // REMOVE ITEM
  const removeFromCart = (id) => {
    const updated = cart.filter(item => item.id !== id);
    saveCart(updated);
  };

  const updateQty = (id, qty) => {
  const updated = cart.map(item =>
    item.id === id
      ? { 
          ...item, 
          qty: Number(qty) || 1,  
          price: Number(item.price) || 0 
        }
      : item
    );
    saveCart(updated);
    };

  return {
    cart,
    removeFromCart,
    updateQty
  };
}