import { Link } from "react-router-dom";
import { usePageTitle } from "../lib/usePageTitle";
import { categories, products } from "../data/products";
import HeroSlider from "../components/HeroSlider";

const slug = (category) => category.toLowerCase().replace(/\s*&\s*/g, "-").replace(/\s+/g, "-");

export default function Home() {
  usePageTitle("Musicians World: Guitars, Drums, Keyboards, Pedals & Amps");

  return (
    <>
      <HeroSlider />

      <nav className="category-squares" aria-label="Shop by category">
        {categories.map((category) => {
          const count = products.filter((p) => p.category === category).length;
          return (
            <Link
              key={category}
              to={`/browse?category=${encodeURIComponent(category)}`}
              className="category-square"
              style={{ "--square-image": `url(/categories/${slug(category)}.jpg)` }}
            >
              <span className="square-name">{category}</span>
              <span className="square-count">
                {count} {count === 1 ? "product" : "products"}
              </span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
