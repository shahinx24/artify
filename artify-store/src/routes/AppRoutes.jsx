import { Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import { ROUTES } from "../constants/routes";
import ProtectedRoute from "../components/ProtectedRoute";
import AdminRoute from "../components/AdminRoute";
import AdminRoutes from "../admin/routes/AdminRoutes";

const LoginPage = lazy(() => import("../pages/LoginPage"));
const HomePage = lazy(() => import("../pages/HomePage"));
const ProductsPage = lazy(() => import("../pages/ProductsPage"));
const CategoryProductsPage = lazy(() =>
  import("../pages/NonAuth/CategoryProductsPage")
);
const CartPage = lazy(() => import("../pages/UserAuth/CartPage"));
const OrdersPage = lazy(() => import("../pages/UserAuth/OrdersPage"));
const NotFound = lazy(() => import("../pages/NonAuth/NotFound"));

export default function AppRoutes() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>

        {/* Public */}
        <Route path={ROUTES.HOME} element={<HomePage />} />
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
        <Route path={ROUTES.PRODUCTS} element={<ProductsPage />} />
        <Route path={ROUTES.PRODUCT_CATEGORY} element={<CategoryProductsPage />} />
        <Route path={ROUTES.CART} element={<CartPage />} />

        {/* Protected */}
        <Route
          path={ROUTES.ORDERS}
          element={
            <ProtectedRoute>
              <OrdersPage />
            </ProtectedRoute>
          }
        />

        {/* Admin */}
        <Route
          path={`${ROUTES.ADMIN}/*`}
          element={
            <AdminRoute>
              <AdminRoutes />
            </AdminRoute>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}