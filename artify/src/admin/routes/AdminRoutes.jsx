import { Routes, Route } from "react-router-dom";
import { lazy } from "react";
import { Navigate } from "react-router-dom";

const AdminDashboard = lazy(() => import("../pages/AdminDashboard"));
const UsersManagement = lazy(() => import("../pages/UsersManagement"));
const OrdersManagement = lazy(() => import("../pages/OrdersManagement"));
const ProductsManagement = lazy(() => import("../pages/ProductsManagement"));
const AddProduct = lazy(() => import("../pages/AddProduct"));

export default function AdminRoutes({ children }) {
  const admin = JSON.parse(localStorage.getItem("admin"));

  if (!admin) {
    return <Navigate to="/" replace />;
  }

  return children;
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