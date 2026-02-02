import { Link } from "react-router-dom";
import { categories } from "../../data/categories.js";
import "../style/home.css"
import useProducts from "../../hooks/useProducts";

export default function HomePage({ authMode, setAuthMode, showToast }) {
  const { products, loading } = useProducts();

  return (
    <>
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
            Artify is more than a supply store — it’s a creative movement.
            We provide premium, thoughtfully crafted art materials designed to elevate every artist’s imagination.
            Whether you’re a beginner exploring your first sketchbook or a seasoned creator shaping your next masterpiece,
            Artify brings you tools that feel luxurious, perform beautifully, and inspire bold expression.
          </p>
        </section>
      </div>
    </>
  );
}