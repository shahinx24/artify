import { useEffect, useState } from "react";
import { ENV } from "../constants/env";

export default function useOrders({user}) {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (!user) return;

    fetch(`${ENV.API_BASE_URL}/orders?userId=${user.id}`)
      .then(res => res.json())
      .then(setOrders);
  }, [user]);

  return orders;
}