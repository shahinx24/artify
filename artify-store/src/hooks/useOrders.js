import { useEffect, useState } from "react";
import { ENV } from "../constants/env";
import { getUser } from "../utils/userHelpers";

export default function useOrders() {
  const [orders, setOrders] = useState([]);
  const user = getUser();

  useEffect(() => {
    if (!user) return;

    fetch(`${ENV.API_BASE_URL}/orders?userId=${user.id}`)
      .then(res => res.json())
      .then(setOrders);
  }, [user]);

  return orders;
}