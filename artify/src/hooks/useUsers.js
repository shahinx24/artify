import { useEffect, useState, useCallback } from "react";
import { getUsers, updateUser, deleteUserById } from "../services/userService";

export default function useUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getUsers()
      .then(res => setUsers(res.data))
      .finally(() => setLoading(false));
  }, []);

  const toggleUser = useCallback(async (id, isActive) => {
    await updateUser(id, { isActive: !isActive });
    setUsers(prev =>
      prev.map(u =>
        u.id === id ? { ...u, isActive: !isActive } : u
      )
    );
  }, []);

  const deleteUser = useCallback(async (id) => {
    await deleteUserById(id);
    setUsers(prev => prev.filter(u => u.id !== id));
  }, []);

  return { users, loading, toggleUser, deleteUser };
}