import { Routes, Route, Navigate } from "react-router-dom";
import { Suspense, lazy } from "react";

const HomePage = lazy(() => import("../pages/HomePage.jsx"));
const ProductsPage = lazy(() => import("../pages/ProductsPage.jsx"));
const CartPage = lazy(() => import("../pages/CartPage.jsx"));
const WishlistPage = lazy(() => import("../pages/WishlistPage.jsx"));
const PaymentPage = lazy(() => import("../pages/PaymentPage.jsx"));
const OrdersPage = lazy(() => import("../pages/OrdersPage.jsx"));
const NotFound = lazy(() => import("../pages/NotFound.jsx"));
const AdminRoutes = lazy(() => import("../admin/routes/AdminRoutes.jsx"));

export default function AppRoutes({ user, setAuthMode, showToast }) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>

        {/* ---------- ADMIN ---------- */}
        <Route
          path="/admin/*"
          element={
            <Suspense fallback={<div>Loading Admin...</div>}>
              <AdminRoutes />
            </Suspense>
          }
        />

        {/* ---------- PUBLIC ---------- */}
        <Route
          path="/"
          element={
            <HomePage
              setAuthMode={setAuthMode}
              showToast={showToast}
            />
          }
        />

        <Route
          path="/products/:category?"
          element={<ProductsPage showToast={showToast} />}
        />

        {/* ---------- PROTECTED USER ---------- */}
        <Route
          path="/wishlist"
          element={user ? <WishlistPage showToast={showToast} /> : <Navigate to="/" />}
        />

        <Route
          path="/cart"
          element={user ? <CartPage showToast={showToast} /> : <Navigate to="/" />}
        />

        <Route
          path="/checkout"
          element={user ? <PaymentPage showToast={showToast} /> : <Navigate to="/" />}
        />

        <Route
          path="/orders"
          element={user ? <OrdersPage showToast={showToast} /> : <Navigate to="/" />}
        />

        <Route path="*" element={<NotFound />} />

      </Routes>
    </Suspense>
  );
}