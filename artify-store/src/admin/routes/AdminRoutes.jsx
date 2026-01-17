import { Routes, Route } from "react-router-dom";
import { lazy } from "react";
import { ROUTES } from "../../constants/routes";

const AdminDashboard = lazy(() => import("../pages/AdminDashboard"));
const UsersManagement = lazy(() => import("../pages/UsersManagement"));
const OrdersManagement = lazy(() => import("../pages/OrdersManagement"));
const ProductsManagement = lazy(() => import("../pages/ProductsManagement"));

export default function AdminRoutes() {
  return (
    <Routes>
      <Route index element={<AdminDashboard />} />
      <Route path="users" element={<UsersManagement />} />
      <Route path="orders" element={<OrdersManagement />} />
      <Route path="products" element={<ProductsManagement />} />
    </Routes>
  );
}