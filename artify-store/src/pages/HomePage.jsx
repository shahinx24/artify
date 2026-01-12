import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../App.css";
import Navbar from "../components/Navbar.jsx";
import { categories } from "../data/categories.js";

export default function HomePage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:3000/products")
      .then(res => setProducts(res.data));
  }, []);

  // const categories = [...new Set(products.map(p => p.category))];
  const availableCategories = [...new Set(products.map(p => p.category))];

  const scrollTo = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <Navbar scrollTo={scrollTo} />
      <div className="page-content">
      <section id="hero" className="hero">
        <div className="hero-text">
          <h1 className="logo">Artify</h1>
          <h2>Create, Imagine, Artify!</h2>
          <p>Unlock premium supplies for every artist.</p>
        </div>
      </section>

      <section id="categories" className="category-section">
        <h2 className="section-title">Shop by Category</h2>
        <div className="product-grid">
          {categories.map(cat => (
            <Link
              key={cat.id}
              to={`/products/${cat.id}`}
              className="category-card"
              style={{ backgroundImage: `url(${cat.image})` }}
            >
              <div className="category-overlay"></div>
              <h3>{cat.name}</h3>
            </Link>
          ))}
        </div>
      </section>

      <section id="about" className="about-section">
        <h2 className="section-title">About Artify</h2>
        <p className="about-text">
          Artify is more than a supply store — it's a creative movement.
          We provide premium, thoughtfully crafted art materials designed to elevate every artist’s imagination.
          Whether you're a beginner exploring your first sketchbook or a seasoned creator shaping your next masterpiece,
          Artify brings you tools that feel luxurious, perform beautifully, and inspire bold expression.

          Every product in our collection is hand-selected with purpose, tested with passion, and powered by the spirit of creativity.
          At Artify, we believe art should be accessible, empowering, and limitless — and we’re here to help you turn imagination into reality.
        </p>
      </section>
      </div>
    </>
  );
}