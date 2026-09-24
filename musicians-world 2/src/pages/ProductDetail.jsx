import { useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { products } from "../data/products";
import { track, toGaItem } from "../lib/analytics";

const swatchClass = {
  Guitars: "tile-guitars",
  Drums: "tile-drums",
  Keyboards: "tile-keyboards",
  "Pedals & Amps": "tile-pedals",
};

export default function ProductDetail() {
  const { id } = useParams();
  const product = products.find((p) => p.id === id);
  const [added, setAdded] = useState(false);
  const lastViewed = useRef(null);

  useEffect(() => {
    setAdded(false);
    if (!product || lastViewed.current === product.id) return;
    lastViewed.current = product.id;
    track("view_item", {
      currency: "USD",
      value: product.price,
      items: [toGaItem(product)],
    });
  }, [product]);

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

  function handleAddToCart() {
    if (added) return;
    track("add_to_cart", {
      currency: "USD",
      value: product.price,
      button_location: "product_info",
      items: [toGaItem(product)],
    });
    setAdded(true);
  }

  return (
    <div className="product-detail">
      <div className={`swatch-large ${swatchClass[product.category]}`}>{product.category}</div>
      <div className="product-info">
        <p className="category-label">{product.category}</p>
        <h1>{product.name}</h1>
        <div className="price-tag">${product.price}</div>
        <p>{product.description}</p>
        <button className="add-to-cart" onClick={handleAddToCart} disabled={added}>
          {added ? "Added to Cart" : "Add to Cart"}
        </button>
        {added && (
          <p className="cart-confirm" role="status">
            {product.name} was added to your cart.
          </p>
        )}
        <Link to="/browse" className="back-link">
          ← Back to browse
        </Link>
      </div>
    </div>
  );
}
