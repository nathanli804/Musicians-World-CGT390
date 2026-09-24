import { Link } from "react-router-dom";
import { usePageTitle } from "../lib/usePageTitle";
import { categories, products } from "../data/products";

const slug = (category) => category.toLowerCase().replace(/\s*&\s*/g, "-").replace(/\s+/g, "-");

export default function Home() {
  usePageTitle("Musicians World: Guitars, Drums, Keyboards, Pedals & Amps");

  return (
    <>
      <section className="hero">
        <h1>Every instrument has a next step.</h1>
        <p>
          Browse gear by category and price, or book a lesson to get more out of
          what you already own.
        </p>
        <Link to="/browse" className="hero-cta">
          Browse gear
        </Link>
      </section>

      <nav className="category-strips" aria-label="Shop by category">
        {categories.map((category) => {
          const count = products.filter((p) => p.category === category).length;
          return (
            <Link
              key={category}
              to={`/browse?category=${encodeURIComponent(category)}`}
              className="category-strip"
              style={{ "--strip-image": `url(/categories/${slug(category)}.jpg)` }}
            >
              <span className="strip-name">{category}</span>
              <span className="strip-count">
                {count} {count === 1 ? "product" : "products"}
              </span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
