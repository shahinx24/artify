import { useState, useEffect } from "react";
import Toast from "./components/Toast";
import { registerToast } from "./utils/toast";
import AppRoutes from "./routes/AppRoutes";
import Navbar from "./components/Navbar";

export default function App() {
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    registerToast(setToastMessage);
  }, []);

  return (
    <>
      <Navbar />
      <AppRoutes />
      <Toast message={toastMessage} />
    </>
  );
}