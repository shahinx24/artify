import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../App.css";
import CartButton from "../components/CartButton.jsx";


export default function HomePage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:3000/products")
      .then(res => setProducts(res.data));
  }, []);

  // Get unique list of categories from products
  const categories = [...new Set(products.map(p => p.category))];

  return (
    <>
      <header>
        <h1>Artify Store</h1>
        <p>Everything a creator needs</p>
        <CartButton />
      </header>


      <div className="hero"></div>

      <div className="product-grid">
        {categories.map(cat => (
          <Link 
            key={cat} 
            to={`/products/${cat}`} 
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <div className="product-card">
              <h2>{cat}</h2>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}