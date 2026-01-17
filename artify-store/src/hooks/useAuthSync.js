import { useEffect, useState } from "react";
import { getUser } from "../utils/userHelpers";

export default function useAuthSync() {
  const [user, setUser] = useState(getUser());

  useEffect(() => {
    const syncAuth = () => {
      setUser(getUser());
    };

    window.addEventListener("storage", syncAuth);
    return () => window.removeEventListener("storage", syncAuth);
  }, []);

  return user;
}