import { Routes, Route, Navigate } from "react-router-dom";
import { Suspense, lazy } from "react";
import { ROUTES } from "../constants/routes";
import ProtectedRoute from "../components/ProtectedRoute";
import AdminRoute from "../components/AdminRoute";
import AdminRoutes from "../admin/routes/AdminRoutes";

const AuthPage = lazy(() => import("../pages/Auth/AuthPage"));
const HomePage = lazy(() => import("../pages/NonAuth/HomePage"));
const ProductsPage = lazy(() => import("../pages/NonAuth/ProductsPage"));
const CartPage = lazy(() => import("../pages/UserAuth/CartPage"));
const OrdersPage = lazy(() => import("../pages/UserAuth/OrdersPage"));
const WishlistPage = lazy(() => import("../pages/UserAuth/WishlistPage"));
const PaymentPage = lazy(() => import("../pages/UserAuth/PaymentPage"));
const NotFound = lazy(() => import("../pages/NonAuth/NotFound"));

export default function AppRoutes({ user, showToast }) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>

        {/* Public */}
        <Route path={ROUTES.HOME} element={<HomePage />} />
        <Route path={ROUTES.LOGIN} element={<AuthPage />} />
        <Route path={ROUTES.REGISTER} element={<AuthPage />} />
        <Route
          path={`${ROUTES.PRODUCTS}/:category?`}
          element={<ProductsPage showToast={showToast} />}
        />

        {/* Protected */}
        <Route
          path={ROUTES.CART}
          element={<ProtectedRoute><CartPage /></ProtectedRoute>}
        />
        <Route
          path={ROUTES.WISHLIST}
          element={<ProtectedRoute><WishlistPage /></ProtectedRoute>}
        />
        <Route
          path={ROUTES.ORDERS}
          element={<ProtectedRoute><OrdersPage /></ProtectedRoute>}
        />
        <Route
          path={ROUTES.CHECKOUT}
          element={<ProtectedRoute><PaymentPage /></ProtectedRoute>}
        />

        {/* Admin */}
        <Route
          path={`${ROUTES.ADMIN}/*`}
          element={<AdminRoute><AdminRoutes /></AdminRoute>}
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}