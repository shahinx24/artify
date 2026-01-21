import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "../pages/NonAuth/HomePage.jsx";
import ProductsPage from "../pages/NonAuth/ProductsPage.jsx";
import CartPage from "../pages/UserAuth/CartPage.jsx";
import WishlistPage from "../pages/UserAuth/WishlistPage.jsx";
import NotFound from "../pages/NonAuth/NotFound.jsx";
import PaymentPage from "../pages/UserAuth/PaymentPage.jsx";
import OrdersPage from "../pages/UserAuth/OrdersPage.jsx";

export default function AppRoutes({ user, setAuthMode, showToast }) {
  return (
    <Routes>
      <Route path="/" element={<HomePage setAuthMode={setAuthMode} showToast={showToast} />} />
      <Route path="/products/:category" element={<ProductsPage showToast={showToast} />} />
      <Route path="/wishlist" element={<WishlistPage showToast={showToast} />} />
      <Route path="/cart" element={<CartPage showToast={showToast} />} />
      <Route path="/checkout" element={user ? <PaymentPage showToast={showToast} /> : <Navigate to="/" />} />
      <Route path="/orders" element={user ? <OrdersPage showToast={showToast} /> : <Navigate to="/" />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}