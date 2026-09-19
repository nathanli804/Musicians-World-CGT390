import { useParams, Link } from "react-router-dom";
import { products } from "../data/products";

const swatchClass = {
  Guitars: "tile-guitars",
  Drums: "tile-drums",
  Keyboards: "tile-keyboards",
  "Pedals & Amps": "tile-pedals",
};

export default function ProductDetail() {
  const { id } = useParams();
  const product = products.find((p) => p.id === id);

  if (!product) {
    return (
      <>
        <h1 className="section-heading">Item not found</h1>
        <p>We couldn't find that product.</p>
        <Link to="/browse" className="back-link">
          ← Back to browse
        </Link>
      </>
    );
  }

  return (
    <div className="product-detail">
      <div className={`swatch-large ${swatchClass[product.category]}`}>{product.category}</div>
      <div className="product-info">
        <p className="category-label">{product.category}</p>
        <h1>{product.name}</h1>
        <div className="price-tag">${product.price}</div>
        <p>{product.description}</p>
        <Link to="/browse" className="back-link">
          ← Back to browse
        </Link>
      </div>
    </div>
  );
}
