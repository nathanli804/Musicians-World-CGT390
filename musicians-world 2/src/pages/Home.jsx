import { Link } from "react-router-dom";

export default function Home() {
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

      <div className="category-grid">
        <Link to="/browse?category=Guitars" className="category-tile large tile-guitars">
          Guitars
        </Link>
        <Link to="/browse?category=Drums" className="category-tile tile-drums">
          Drums
        </Link>
        <Link to="/browse?category=Keyboards" className="category-tile tile-keyboards">
          Keyboards
        </Link>
        <Link to="/browse?category=Pedals+%26+Amps" className="category-tile wide tile-pedals">
          Pedals &amp; Amps
        </Link>
      </div>
    </>
  );
}
