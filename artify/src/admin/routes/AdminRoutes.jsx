import { Routes, Route , Navigate, Outlet } from "react-router-dom";
import { lazy } from "react";

const AdminDashboard = lazy(() => import("../pages/AdminDashboard"));
const UsersManagement = lazy(() => import("../pages/UsersManagement"));
const OrdersManagement = lazy(() => import("../pages/OrdersManagement"));
const ProductsManagement = lazy(() => import("../pages/ProductsManagement"));
const AddProduct = lazy(() => import("../pages/AddProduct"));

export default function AdminRoutes() {
  const auth = JSON.parse(localStorage.getItem("auth"));

  if (!auth || auth.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

//   return (
//       <Routes>
//         <Route index element={<AdminDashboard />} />
//         <Route path="users" element={<UsersManagement />} />
//         <Route path="orders" element={<OrdersManagement />} />
//         <Route path="products" element={<ProductsManagement />} />
//         <Route path="add" element={<AddProduct />} />
//       </Routes>
//   );
// }