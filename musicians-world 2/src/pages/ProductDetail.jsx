import { useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { products } from "../data/products";
import { track, toGaItem } from "../lib/analytics";
import { usePageTitle } from "../lib/usePageTitle";
import ProductArt from "../components/ProductArt";
import StarRating from "../components/StarRating";

const catClass = {
  Guitars: "cat-guitars",
  Drums: "cat-drums",
  Keyboards: "cat-keyboards",
  "Pedals & Amps": "cat-pedals",
  "DJ Gear": "cat-dj",
  Microphones: "cat-mics",
};

function useProductSchema(product) {
  useEffect(() => {
    if (!product) return;
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = "product-jsonld";
    script.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Product",
      name: product.name,
      description: product.description,
      category: product.category,
      sku: product.id,
      url: window.location.origin + "/product/" + product.id,
      offers: {
        "@type": "Offer",
        price: product.price.toFixed(2),
        priceCurrency: "USD",
        availability: "https://schema.org/InStock",
      },
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: product.rating,
        reviewCount: product.reviewCount,
      },
    });
    document.head.appendChild(script);
    return () => script.remove();
  }, [product]);
}

export default function ProductDetail() {
  const { id } = useParams();
  const product = products.find((p) => p.id === id);
  const [added, setAdded] = useState(false);
  const lastViewed = useRef(null);
  useProductSchema(product);
  usePageTitle(product ? `${product.name} | Musicians World` : "Item Not Found | Musicians World");

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
      <div className={`product-art large ${catClass[product.category]}`}>
        <ProductArt product={product} />
      </div>
      <div className="product-info">
        <p className="category-label">
          {product.category}
          {product.category === "Guitars" &&
            ` · ${product.type === "acoustic" ? "Acoustic" : "Electric"}`}
        </p>
        {product.leftHanded && <span className="badge detail-badge">Left-handed available</span>}
        <h1>{product.name}</h1>
        <StarRating rating={product.rating} count={product.reviewCount} />
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
