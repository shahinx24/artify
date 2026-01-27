import { Routes, Route, Navigate } from "react-router-dom";
import { Suspense, lazy } from "react";
import AdminRouteConfig from "../admin/routes/Route.jsx";
import { getUser } from "../utils/userHelpers";

const HomePage = lazy(() => import("../pages/HomePage.jsx"));
const ProductsPage = lazy(() => import("../pages/ProductsPage.jsx"));
const CartPage = lazy(() => import("../pages/CartPage.jsx"));
const WishlistPage = lazy(() => import("../pages/WishlistPage.jsx"));
const PaymentPage = lazy(() => import("../pages/PaymentPage.jsx"));
const OrdersPage = lazy(() => import("../pages/OrdersPage.jsx"));
const NotFound = lazy(() => import("../pages/NotFound.jsx"));
const AdminRoutes = lazy(() => import("../admin/routes/AdminRoutes.jsx"));

export default function AppRoutes({ user, setAuthMode, showToast }) {
  const auth = JSON.parse(localStorage.getItem("auth"));

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>

        {/*-ADMIN-*/}
        <Route element={<AdminRoutes />}>
          <Route path="/admin/*" element={<AdminRouteConfig />} />
        </Route>

        {/*-public-*/}
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

        {/*-user-*/}
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
          element={getUser() ? <PaymentPage showToast={showToast} /> : <Navigate to="/login" />}
        />

        <Route
          path="/orders"
          element={getUser() ? <OrdersPage showToast={showToast} /> : <Navigate to="/login" />}
        />

        <Route path="*" element={<NotFound />} />

      </Routes>
    </Suspense>
  );
}