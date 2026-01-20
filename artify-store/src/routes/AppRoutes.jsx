import { Routes, Route } from "react-router-dom";
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
const NotFound = lazy(() => import("../pages/NonAuth/NotFound"));
const WishlistPage = lazy(()=> import("../pages/WishlistPage"));
const PaymentPage = lazy(()=> import("../pages/PaymentPage"));
// const Login = lazy(()=> import("../pages/Login"));
// const Register = lazy(()=> import("../pages/Register"));

export default function AppRoutes() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>

        {/* Public */}
        <Route path={ROUTES.HOME} element={<HomePage />} />
        <Route path={ROUTES.LOGIN} element={<AuthPage />} />
        <Route path={ROUTES.REGISTER} element={<AuthPage />} />
        <Route path={ROUTES.PRODUCTS} element={<ProductsPage />} />
        <Route path={`${ROUTES.PRODUCTS}/:category`} element={<ProductsPage />} />
        <Route path={ROUTES.CART} element={<CartPage />} />
        <Route path={ROUTES.WishlistPage} element={<WishlistPage />} />

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

        {/* <Route
        path={ROUTES.LOGIN}
        element={<Login setAuthMode={setAuthMode} />}
      />

      <Route
        path={ROUTES.REGISTER}
        element={<Register setAuthMode={setAuthMode} />}
      /> */}

      {/* Protected */}
      <Route
        path="/checkout"
        element={user ? <PaymentPage /> : <Navigate to={ROUTES.LOGIN} />}
      />

      <Route
        path={ROUTES.ORDERS}
        element={user ? <OrdersPage /> : <Navigate to={ROUTES.LOGIN} />}
      />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}