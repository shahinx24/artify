import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import ProductsPage from "./pages/ProductsPage.jsx";
import CartPage from "./pages/CartPage.jsx";
import WishlistPage from "./pages/WishlistPage.jsx";
import NotFound from "./pages/NotFound.jsx";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import AuthPanel from "./components/AuthPanel.jsx";

export default function App() {
  const [authMode, setAuthMode] = useState(null);

  return (
    <>
      <Navbar setAuthMode={setAuthMode} />
      <div className="home">
        {!localStorage.getItem("user") && (
                <AuthPanel authMode={authMode} setAuthMode={setAuthMode} />
            )}
      </div>

      <Routes>
        <Route path="/" element={
          <HomePage authMode={authMode} setAuthMode={setAuthMode} />
        } />
        <Route path="/products/:category" element={<ProductsPage />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      
      <Footer />
    </>
  );
}