import { createHash, randomBytes, timingSafeEqual } from "node:crypto";

export function send(res, status, body) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(body));
}

export function methodNotAllowed(res, allowed) {
  res.setHeader("Allow", allowed.join(", "));
  return send(res, 405, { error: "method_not_allowed", allowed });
}

// Vercel pre-parses JSON into req.body; the local dev server passes the raw string.
export async function readJson(req) {
  const type = String(req.headers["content-type"] || "");
  if (!type.includes("application/json")) {
    return { error: { status: 415, body: { error: "unsupported_media_type", message: "Send Content-Type: application/json" } } };
  }
  let body = req.body;
  try {
    if (body === undefined) {
      const chunks = [];
      for await (const chunk of req) chunks.push(chunk);
      body = Buffer.concat(chunks).toString("utf8");
    }
    if (typeof body === "string") body = body.length ? JSON.parse(body) : undefined;
  } catch {
    return { error: { status: 400, body: { error: "invalid_json" } } };
  }
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return { error: { status: 400, body: { error: "invalid_json", message: "Body must be a JSON object" } } };
  }
  return { body };
}

export function newManageToken() {
  return randomBytes(24).toString("base64url");
}

export function hashToken(token) {
  return createHash("sha256").update(String(token)).digest("hex");
}

export function safeEqual(a, b) {
  const x = Buffer.from(String(a));
  const y = Buffer.from(String(b));
  return x.length === y.length && timingSafeEqual(x, y);
}

const onVercel = Boolean(process.env.VERCEL);

export function staffKey() {
  return process.env.MW_STAFF_KEY || (onVercel ? null : "dev-staff-key");
}

export function isStaff(req) {
  const key = staffKey();
  const header = String(req.headers.authorization || "");
  if (!key || !header.startsWith("Bearer ")) return false;
  return safeEqual(header.slice(7), key);
}
