import { Routes, Route, Navigate } from "react-router-dom";
import { Suspense, lazy } from "react";
import AdminRouteConfig from "../admin/routes/Route.jsx";
import { useAuth } from "../hooks/useAuth.js";
// import { getUser } from "../utils/userHelpers";

const HomePage = lazy(() => import("../pages/HomePage.jsx"));
const ProductsPage = lazy(() => import("../pages/ProductsPage.jsx"));
const CartPage = lazy(() => import("../pages/CartPage.jsx"));
const WishlistPage = lazy(() => import("../pages/WishlistPage.jsx"));
const PaymentPage = lazy(() => import("../pages/PaymentPage.jsx"));
const OrdersPage = lazy(() => import("../pages/OrdersPage.jsx"));
const NotFound = lazy(() => import("../pages/NotFound.jsx"));
const AdminRoutes = lazy(() => import("../admin/routes/AdminRoutes.jsx"));

export default function AppRoutes({ showToast }) {
  const { auth, loading } = useAuth();
  if (loading) return null;
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>

        {/* ADMIN */}
        <Route element={<AdminRoutes />}>
          <Route path="/admin/*" element={<AdminRouteConfig />} />
        </Route>

        {/* PUBLIC (popup auth lives here) */}
        <Route path="/" element={<HomePage showToast={showToast} />} />
        <Route path="/login" element={<HomePage showToast={showToast} />} />
        <Route path="/register" element={<HomePage showToast={showToast} />} />

        <Route
          path="/products/:category?"
          element={<ProductsPage showToast={showToast} />}
        />

        {/* USER PROTECTED */}
        <Route
          path="/wishlist"
          element={auth ? <WishlistPage showToast={showToast} /> : <Navigate to="/login" />}
        />

        <Route
          path="/cart"
          element={auth ? <CartPage showToast={showToast} /> : <Navigate to="/login" />}
        />

        <Route
          path="/checkout"
          element={auth ? <PaymentPage showToast={showToast} /> : <Navigate to="/login" />}
        />

        <Route
          path="/orders"
          element={auth ? <OrdersPage showToast={showToast} /> : <Navigate to="/login" />}
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}