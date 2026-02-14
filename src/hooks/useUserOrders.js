import { useState } from "react";
import { getOrdersByEmail } from "../services/orderService";

export default function useUserOrders() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [orders, setOrders] = useState([]);

  const viewOrders = async (email) => {
    if (selectedUser === email) {
      setSelectedUser(null);
      setOrders([]);
      return;
    }

    const res = await getOrdersByEmail(email);
    setOrders(res.data);
    setSelectedUser(email);
  };

  return { selectedUser, orders, viewOrders };
}