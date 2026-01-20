import { useState, useEffect } from "react";
import Toast from "./components/Toast";
import { registerToast } from "./utils/toast";
import AppRoutes from "./routes/AppRoutes";
import Navbar from "./components/Navbar";
import {getUser} from "./utils/userHelpers"

export default function App() {
  const [user, setUser] = useState(getUser());
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    registerToast(setToastMessage);
  }, []);

  return (
    <>
        <Navbar />
        <AppRoutes
          user={user}
          setUser={setUser}
        />
        <Toast message={toastMessage} />
    </>
  );
}