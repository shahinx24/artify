import { Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import AdminLayout from "../layout/AdminLayout";

const AdminDashboard = lazy(() => import("../pages/AdminDashboard"));
const UsersManagement = lazy(() => import("../pages/UsersManagement"));
const ProductsManagement = lazy(() => import("../pages/ProductsManagement"));
const OrdersManagement = lazy(() => import("../pages/OrdersManagement"));
const AddProduct = lazy(() => import("../pages/AddProduct"));

export default function AdminRouteConfig() {
  return (
    <Suspense fallback={<div>Loading admin...</div>}>
      <Routes>
        <Route element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<UsersManagement />} />
          <Route path="products" element={<ProductsManagement />} />
          <Route path="orders" element={<OrdersManagement />} />
          <Route path="add" element={<AddProduct />} />
        </Route>
      </Routes>
    </Suspense>
  );
}