export function track(eventName, params = {}) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("event", eventName, params);
}

export function toGaItem(product) {
  return {
    item_id: product.id,
    item_name: product.name,
    item_category: product.category,
    price: product.price,
  };
}
