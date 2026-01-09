import { useContext } from "react";
import { CartContext } from "../context/CartContext.jsx";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";

export default function ProductsPage() {
  const { category } = useParams();  // read category from URL
  const [products, setProducts] = useState([]);
  const { addToCart } = useContext(CartContext);


  useEffect(() => {
    axios.get("http://localhost:3000/products")
      .then(res => setProducts(res.data));
  }, []);

  const filtered = products.filter(p => p.category === category);
  return (
    <div className="page-content">
      <Navbar />
        <h1>{category} Products</h1>
      {filtered.length === 0 && <p>No products in this category</p>}

      <div className="product-grid">
        {filtered.map(p => (
          <div className="product-card" key={p.id}>
            <img src={p.image} alt={p.name} />
            <h4>{p.name}</h4>
            <p>₹{p.price}</p>
            <button onClick={() => addToCart(p)}>Add to Cart</button>
          </div>
        ))}
      </div>
    </div>
  );
}