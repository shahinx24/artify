import { useEffect, useState } from "react";
import { getProducts } from "../services/productService";

export default function useProducts({ category } = {}) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);

    getProducts()
      .then(res => {
        const data = res.data;
        setProducts(
          category
            ? data.filter(p => p.category === category)
            : data
        );
      })
      .catch(err => setError(err))
      .finally(() => setLoading(false));
  }, [category]);

  return { products, loading, error };
}