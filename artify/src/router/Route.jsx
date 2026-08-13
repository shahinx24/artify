import { Routes, Route, Navigate } from "react-router-dom";
import { Suspense, lazy } from "react";
import AdminRouteConfig from "../admin/routes/Route.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import AuthPage from "../pages/auth/AuthPage.jsx";

const HomePage = lazy(() => import("../pages/NonAuth/HomePage.jsx"));
const ProductsPage = lazy(() => import("../pages/NonAuth/ProductsPage.jsx"));
const CartPage = lazy(() => import("../pages/UserAuth/CartPage.jsx"));
const WishlistPage = lazy(() => import("../pages/UserAuth/WishlistPage.jsx"));
const PaymentPage = lazy(() => import("../pages/UserAuth/PaymentPage.jsx"));
const OrdersPage = lazy(() => import("../pages/UserAuth/OrdersPage.jsx"));
const NotFound = lazy(() => import("../pages/NonAuth/NotFound.jsx"));
const AdminRoutes = lazy(() => import("../admin/routes/AdminRoutes.jsx"));

export default function AppRoutes({ showToast }) {
  const { auth, loading } = useAuth();
  if (loading) return null;
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="app-route-content">
        <Routes>

        {/* ADMIN */}
        <Route element={<AdminRoutes />}>
          <Route path="/admin/*" element={<AdminRouteConfig showToast={showToast} />} />
        </Route>

        {/* PUBLIC */}
        <Route path="/" element={<HomePage showToast={showToast} />} />
        <Route path="/login" element={<AuthPage showToast={showToast} />} />
        <Route path="/register" element={<AuthPage showToast={showToast} />} />

        <Route
          path="/products/:category?"
          element={<ProductsPage showToast={showToast} />}
        />

        {/* USER PROTECTED */}
        <Route
          path="/wishlist"
          element={auth?.role === "user" ? <WishlistPage showToast={showToast} /> : <Navigate to="/login" replace />}
        />

        <Route
          path="/cart"
          element={auth?.role === "user" ? <CartPage showToast={showToast} /> : <Navigate to="/login" replace />}
        />

        <Route
          path="/checkout"
          element={auth?.role === "user" ? <PaymentPage showToast={showToast} /> : <Navigate to="/login" replace />}
        />

        <Route
          path="/orders"
          element={auth?.role === "user" ? <OrdersPage showToast={showToast} /> : <Navigate to="/login" replace />}
        />

        <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Suspense>
  );
}
