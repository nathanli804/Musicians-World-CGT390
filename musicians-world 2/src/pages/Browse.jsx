import { useMemo, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { track, toGaItem } from "../lib/analytics";
import { products, categories } from "../data/products";
import { usePageTitle } from "../lib/usePageTitle";
import ProductArt from "../components/ProductArt";
import StarRating from "../components/StarRating";

const catClass = {
  Guitars: "cat-guitars",
  Drums: "cat-drums",
  Keyboards: "cat-keyboards",
  "Pedals & Amps": "cat-pedals",
};

function matchesQuery(product, q) {
  if (!q) return true;
  const haystack = `${product.name} ${product.blurb} ${product.category} ${product.type}`.toLowerCase();
  return q
    .toLowerCase()
    .split(/\s+/)
    .every((word) => haystack.includes(word));
}

export default function Browse() {
  usePageTitle("Browse Gear | Musicians World");
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get("category");
  const query = (searchParams.get("q") || "").trim();

  const [activeCategories, setActiveCategories] = useState(
    initialCategory && categories.includes(initialCategory) ? [initialCategory] : []
  );
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [leftHandedOnly, setLeftHandedOnly] = useState(false);

  const toggleCategory = (category) => {
    setActiveCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
  };

  const resetFilters = () => {
    setActiveCategories([]);
    setMinPrice("");
    setMaxPrice("");
    setLeftHandedOnly(false);
  };

  const clearSearch = () => {
    const next = new URLSearchParams(searchParams);
    next.delete("q");
    setSearchParams(next);
  };

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory =
        activeCategories.length === 0 || activeCategories.includes(product.category);
      const min = minPrice === "" ? -Infinity : Number(minPrice);
      const max = maxPrice === "" ? Infinity : Number(maxPrice);
      const matchesPrice = product.price >= min && product.price <= max;
      const matchesHand = !leftHandedOnly || product.leftHanded;
      return matchesCategory && matchesPrice && matchesHand && matchesQuery(product, query);
    });
  }, [activeCategories, minPrice, maxPrice, leftHandedOnly, query]);

  const count = filteredProducts.length;
  const itemWord = count === 1 ? "item" : "items";

  return (
    <>
      <h1 className="section-heading">{query ? "Search results" : "Browse gear"}</h1>
      <div className="browse-layout">
        <aside className="filter-panel">
          <h2>Filters</h2>
          <fieldset className="filter-group">
            <legend>Category</legend>
            {categories.map((category) => (
              <label key={category}>
                <input
                  type="checkbox"
                  checked={activeCategories.includes(category)}
                  onChange={() => toggleCategory(category)}
                />
                {category}
              </label>
            ))}
          </fieldset>

          <fieldset className="filter-group">
            <legend>Price range</legend>
            <div className="price-inputs">
              <input
                type="number"
                min="0"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                aria-label="Minimum price"
              />
              <span>–</span>
              <input
                type="number"
                min="0"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                aria-label="Maximum price"
              />
            </div>
          </fieldset>

          <fieldset className="filter-group">
            <legend>Guitar options</legend>
            <label>
              <input
                type="checkbox"
                checked={leftHandedOnly}
                onChange={(e) => setLeftHandedOnly(e.target.checked)}
              />
              Left-handed available
            </label>
          </fieldset>

          <button className="reset-filters" onClick={resetFilters}>
            Reset filters
          </button>
        </aside>

        <div>
          <div className="result-bar">
            <p className="result-count" role="status">
              {query ? (
                <>
                  {count} {count === 1 ? "result" : "results"} for <strong>“{query}”</strong>
                </>
              ) : (
                <>
                  {count} {itemWord} found
                </>
              )}
            </p>
            {query && (
              <button className="clear-search" onClick={clearSearch}>
                Clear search
              </button>
            )}
          </div>

          {count === 0 ? (
            <div className="empty-state">
              {query ? (
                <p>
                  Nothing matches “{query}” with the current filters. Check the spelling,
                  try a broader word like guitar or drums, or reset the filters.
                </p>
              ) : (
                <p>
                  No gear matches those filters. Try widening the price range or clearing a
                  category.
                </p>
              )}
            </div>
          ) : (
            <div className="product-grid">
              {filteredProducts.map((product) => (
                <Link
                  key={product.id}
                  to={`/product/${product.id}`}
                  className="product-card"
                  onClick={() =>
                    track("select_item", {
                      item_list_name: query ? "search_results" : "browse_results",
                      items: [toGaItem(product)],
                    })
                  }
                >
                  <div className={`product-art ${catClass[product.category]}`}>
                    <ProductArt product={product} />
                  </div>
                  <div className="product-card-body">
                    <h3>{product.name}</h3>
                    <StarRating rating={product.rating} count={product.reviewCount} />
                    <span className="price">${product.price}</span>
                    <p className="blurb">{product.blurb}</p>
                    {product.leftHanded && <span className="badge">Left-handed available</span>}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
