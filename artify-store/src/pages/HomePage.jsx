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

  const categories = [...new Set(products.map(p => p.category))];

  const scrollTo = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <header className="top-nav">
        <nav>
          <button onClick={() => scrollTo("hero")} className="nav-btn">Home</button>
          <button onClick={() => scrollTo("categories")} className="nav-btn">Category</button>
          <button onClick={() => scrollTo("about")} className="nav-btn">About</button>
          <button onClick={() => scrollTo("contact")} className="nav-btn">Contact</button>
        </nav>
        <CartButton />
      </header>

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
            <Link key={cat} to={`/products/${cat}`} className="product-card">
              <h3>{cat}</h3>
            </Link>
          ))}
        </div>
      </section>

      <section id="about" className="about-section">
        <h2 className="section-title">About Artify</h2>
        <p className="about-text">
          Artify is a premium artist supply brand bringing luxury-grade materials
          to creators of every level. Designed with passion, powered by creativity.
        </p>
      </section>

      <section id="contact" className="contact-section">
        <h2 className="section-title">Contact Us</h2>

        <div className="contact-items">
          <p><strong>Email:</strong> artifystore@gmail.com</p>
          <p><strong>Phone:</strong> +91 9876543210</p>

          <div className="social-icons">
            <a href="#" target="_blank" aria-label="Instagram">
              🟣 Instagram
            </a>
            <a href="#" target="_blank" aria-label="Facebook">
              🔵 Facebook
            </a>
            <a href="mailto:artifystore@gmail.com" aria-label="Email">
              ✉️ Gmail
            </a>
          </div>
        </div>
      </section>
    </>
  );
}