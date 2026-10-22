import { randomUUID } from "node:crypto";
import { send, methodNotAllowed, readJson, newManageToken, hashToken, isStaff } from "../_lib/http.js";
import { getStore } from "../_lib/store.js";
import { validateCreate, findLesson, toOwnerView, toStaffView } from "../_lib/lessonRequest.js";

// POST /api/lesson-requests  — public: create a booking request
// GET  /api/lesson-requests  — staff only: list all requests
export default async function handler(req, res) {
  if (req.method === "POST") return create(req, res);
  if (req.method === "GET") return list(req, res);
  return methodNotAllowed(res, ["GET", "POST"]);
}

async function create(req, res) {
  const parsed = await readJson(req);
  if (parsed.error) return send(res, parsed.error.status, parsed.error.body);

  const { value, errors } = validateCreate(parsed.body);
  if (errors) return send(res, 400, { error: "validation_failed", fields: errors });

  const lesson = findLesson(value.lessonId);
  if (!lesson) return send(res, 422, { error: "unknown_lesson", message: `No lesson with id "${value.lessonId}"` });

  const store = getStore();
  if (!store) return send(res, 503, { error: "storage_not_configured" });

  const id = randomUUID();
  const claimed = await store.claimPending(lesson.id, value.email, id);
  if (!claimed) {
    return send(res, 409, {
      error: "duplicate_request",
      message: "This email already has a pending request for this lesson.",
    });
  }

  const manageToken = newManageToken();
  const record = {
    id,
    lessonId: lesson.id,
    lessonTitle: lesson.title,
    price: lesson.price, // taken from the catalog, never from the client
    name: value.name,
    email: value.email,
    preferredTime: value.preferredTime,
    note: value.note,
    status: "pending",
    createdAt: new Date().toISOString(),
    manageTokenHash: hashToken(manageToken),
  };

  try {
    await store.put(record);
  } catch (err) {
    await store.releasePending(lesson.id, value.email);
    throw err;
  }

  res.setHeader("Location", `/api/lesson-requests/${id}`);
  return send(res, 201, { ...toOwnerView(record), manageToken });
}

async function list(req, res) {
  if (!isStaff(req)) return send(res, 401, { error: "unauthorized", message: "Staff key required" });
  const store = getStore();
  if (!store) return send(res, 503, { error: "storage_not_configured" });
  const all = (await store.list()).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return send(res, 200, { count: all.length, requests: all.map(toStaffView) });
}
