import Footer from "./components/Footer.jsx";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import ProductsPage from "./pages/ProductsPage.jsx";
import CartPage from "./pages/CartPage.jsx";
import NotFound from "./pages/NotFound.jsx";
import { CartProvider } from "./context/CartContext";
import WishlistPage from "./pages/WishlistPage.jsx";
import { useState } from "react";
import HomePage from "./pages/HomePage";
import Navbar from "./components/Navbar";

export default function App() {
  const [authMode, setAuthMode] = useState(null);

  return (
    <CartProvider>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <HomePage authMode={authMode} setAuthMode={setAuthMode} />
        <Navbar setAuthMode={setAuthMode} />
        <Route path="/products/:category" element={<ProductsPage />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </CartProvider>
  );
}