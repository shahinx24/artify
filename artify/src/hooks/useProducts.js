import { useEffect, useState, useCallback } from "react";
import { getProducts } from "../services/productService";

export default function useProducts({
  category = "",
  search = "",
} = {}) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = useCallback(() => {
    setLoading(true);

    getProducts({
      search,
      category,
    })
      .then((res) => {
        setProducts(res.data);
      })
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }, [search, category]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return { products, loading, error, refetch: fetchProducts };
}