import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { ENV } from "../constants/env";
import ProductCard from "../components/ProductCard";

export default function CategoryProductsPage() {
  const { category } = useParams();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch(`${ENV.API_BASE_URL}/products?category=${category}`)
      .then(res => res.json())
      .then(setProducts);
  }, [category]);

  return (
    <div>
      <h2>{category}</h2>

      <div className="products-grid">
        {products.map(p => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}