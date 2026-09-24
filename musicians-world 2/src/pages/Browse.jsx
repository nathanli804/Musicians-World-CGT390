import { useMemo, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { track, toGaItem } from "../lib/analytics";
import { products, categories } from "../data/products";

const swatchClass = {
  Guitars: "tile-guitars",
  Drums: "tile-drums",
  Keyboards: "tile-keyboards",
  "Pedals & Amps": "tile-pedals",
};

export default function Browse() {
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get("category");

  const [activeCategories, setActiveCategories] = useState(
    initialCategory && categories.includes(initialCategory) ? [initialCategory] : []
  );
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const toggleCategory = (category) => {
    setActiveCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
  };

  const resetFilters = () => {
    setActiveCategories([]);
    setMinPrice("");
    setMaxPrice("");
  };

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory =
        activeCategories.length === 0 || activeCategories.includes(product.category);
      const min = minPrice === "" ? -Infinity : Number(minPrice);
      const max = maxPrice === "" ? Infinity : Number(maxPrice);
      const matchesPrice = product.price >= min && product.price <= max;
      return matchesCategory && matchesPrice;
    });
  }, [activeCategories, minPrice, maxPrice]);

  return (
    <>
      <h1 className="section-heading">Browse gear</h1>
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

          <button className="reset-filters" onClick={resetFilters}>
            Reset filters
          </button>
        </aside>

        <div>
          <p className="result-count">
            {filteredProducts.length} item{filteredProducts.length === 1 ? "" : "s"} found
          </p>

          {filteredProducts.length === 0 ? (
            <p className="empty-state">
              No gear matches those filters. Try widening the price range or
              clearing a category.
            </p>
          ) : (
            <div className="product-grid">
              {filteredProducts.map((product) => (
                <Link
                  key={product.id}
                  to={`/product/${product.id}`}
                  className="product-card"
                  onClick={() =>
                    track("select_item", {
                      item_list_name: "browse_results",
                      items: [toGaItem(product)],
                    })
                  }
                >
                  <div className={`product-swatch ${swatchClass[product.category]}`}>
                    {product.category}
                  </div>
                  <div className="product-card-body">
                    <h3>{product.name}</h3>
                    <span className="price">${product.price}</span>
                    <p className="blurb">{product.blurb}</p>
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
