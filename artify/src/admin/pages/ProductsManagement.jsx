import { useEffect, useState } from "react";
import { ENV } from "../../constants/env";

export default function ProductsManagement() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch(`${ENV.API_BASE_URL}/products`)
      .then(res => res.json())
      .then(setProducts);
  }, []);

  return (
    <div>
      <h2>Product Stock</h2>
      {products.map(p => (
        <div key={p.id}>
          {p.title} | Stock: {p.stock}
        </div>
      ))}
    </div>
  );
}