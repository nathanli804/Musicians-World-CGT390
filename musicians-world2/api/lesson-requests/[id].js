import { send, methodNotAllowed, hashToken, safeEqual, isStaff } from "../_lib/http.js";
import { getStore } from "../_lib/store.js";
import { toOwnerView } from "../_lib/lessonRequest.js";

// GET    /api/lesson-requests/:id — owner (X-Manage-Token) or staff
// DELETE /api/lesson-requests/:id — cancel a pending request; owner or staff
export default async function handler(req, res) {
  if (req.method !== "GET" && req.method !== "DELETE") return methodNotAllowed(res, ["GET", "DELETE"]);

  const token = req.headers["x-manage-token"];
  const staff = isStaff(req);
  if (!token && !staff) return send(res, 401, { error: "unauthorized", message: "X-Manage-Token header required" });

  const store = getStore();
  if (!store) return send(res, 503, { error: "storage_not_configured" });

  const record = await store.get(String(req.query.id));
  // Same 404 for "doesn't exist" and "not yours" so ids can't be probed.
  const owns = record && token && safeEqual(hashToken(token), record.manageTokenHash);
  if (!record || (!owns && !staff)) return send(res, 404, { error: "not_found" });

  if (req.method === "GET") return send(res, 200, toOwnerView(record));

  if (record.status !== "pending") {
    return send(res, 409, { error: "invalid_state", message: `Request is already ${record.status}` });
  }
  const updated = { ...record, status: "cancelled", cancelledAt: new Date().toISOString() };
  await store.put(updated);
  await store.releasePending(record.lessonId, record.email);
  return send(res, 200, toOwnerView(updated));
}
