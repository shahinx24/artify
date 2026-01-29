import { useEffect, useState } from "react";
import api from "../services/api";

export default function useOrders({user}) {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (!user) return;

    api.get(`/orders?userId=${user.id}`)
      .then(res => {
        setOrders(res.data);
      });
  }, [user]);

  return orders;
}