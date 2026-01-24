import { useEffect, useState } from "react";
import { getOrders } from "../services/orderService";

export default function useOrders(user) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user?.id) {
      setOrders([]);
      return;
    }

    setLoading(true);

    getOrders(user.id)
      .then(res => setOrders(res.data))
      .catch(err => setError(err))
      .finally(() => setLoading(false));
  }, [user?.id]);

  return { orders, loading, error };
}