import { Link } from "react-router-dom";
import { categories } from "../../data/categories.js";
import "../style/home.css"
import useProducts from "../../hooks/useProducts";
import BrandSlider from "./slideLogos.jsx"

export default function HomePage({ authMode, setAuthMode, showToast }) {
  const { products, loading } = useProducts();
  const withBase = (path) => {
    if (!path || /^https?:\/\//.test(path)) return path;
    return `${import.meta.env.BASE_URL}${path.replace(/^\/+/, "")}`;
  };
  const heroImage = withBase("/images/others/home.webp");

  return (
    <>
      <div className="page-content">
        <section
          id="hero"
          className="hero"
          style={{ backgroundImage: `url("${heroImage}")` }}
        >
          <div className="hero-text">
            <h1 className="logo">Artify</h1>
            <h2>Create, Imagine, Artify!</h2>
            <p>Unlock premium supplies for every artist.</p>
          </div>
        </section>

        <section id="categories" className="category-section">
          <h2 className="section-title1">Shop by Category</h2>
          <div className="product-grid">
            {categories.map(cat => (
              <Link
                key={cat.id}
                to={`/products/${cat.id}`}
                className="category-card"
                style={{ backgroundImage: `url("${withBase(cat.image)}")` }}
              >
                <div className="category-overlay"></div>
                <h3>{cat.name}</h3>
              </Link>
            ))}
          </div>
        </section>

        <section><BrandSlider/></section>

        <section id="about" className="about-section">
          <h2 className="section-title2">About Artify</h2>
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
