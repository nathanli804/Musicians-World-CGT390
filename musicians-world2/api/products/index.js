import { send, methodNotAllowed } from "../_lib/http.js";
import { products, categories } from "../../src/data/products.js";

// GET /api/products — public, read-only product search.
// Query: q, category, minPrice, maxPrice, leftHanded, limit (1-20, default 10)
export default async function handler(req, res) {
  if (req.method !== "GET") return methodNotAllowed(res, ["GET"]);

  const query = req.query || {};
  const errors = {};

  const q = typeof query.q === "string" ? query.q.trim().toLowerCase() : "";

  const category = query.category;
  if (category !== undefined && !categories.includes(category)) {
    errors.category = `must be one of ${categories.join(", ")}`;
  }

  const minPrice = readNumber(query.minPrice, "minPrice", errors);
  const maxPrice = readNumber(query.maxPrice, "maxPrice", errors);
  if (minPrice !== undefined && maxPrice !== undefined && minPrice > maxPrice) {
    errors.maxPrice = "must be greater than or equal to minPrice";
  }

  let leftHanded;
  if (query.leftHanded !== undefined) {
    if (query.leftHanded === "true") leftHanded = true;
    else if (query.leftHanded === "false") leftHanded = false;
    else errors.leftHanded = "must be true or false";
  }

  let limit = 10;
  if (query.limit !== undefined) {
    limit = Number(query.limit);
    if (!Number.isInteger(limit) || limit < 1 || limit > 20) errors.limit = "must be a whole number from 1 to 20";
  }

  if (Object.keys(errors).length) return send(res, 400, { error: "validation_failed", fields: errors });

  const matches = products.filter((p) => {
    if (category && p.category !== category) return false;
    if (minPrice !== undefined && p.price < minPrice) return false;
    if (maxPrice !== undefined && p.price > maxPrice) return false;
    if (leftHanded !== undefined && Boolean(p.leftHanded) !== leftHanded) return false;
    if (q) {
      const haystack = `${p.name} ${p.blurb} ${p.category} ${p.type}`.toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    return true;
  });

  const data = matches.slice(0, limit).map((p) => ({
    id: p.id,
    name: p.name,
    category: p.category,
    type: p.type,
    price: p.price,
    rating: p.rating,
    reviewCount: p.reviewCount,
    leftHanded: Boolean(p.leftHanded),
    blurb: p.blurb,
    url: `/product/${p.id}`,
  }));

  return send(res, 200, { count: data.length, total: matches.length, data });
}

function readNumber(raw, name, errors) {
  if (raw === undefined || raw === "") return undefined;
  const n = Number(raw);
  if (!Number.isFinite(n) || n < 0) {
    errors[name] = "must be a number of US dollars, 0 or more";
    return undefined;
  }
  return n;
}
