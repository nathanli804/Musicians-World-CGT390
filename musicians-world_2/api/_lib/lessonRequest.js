import { lessons } from "../../src/data/lessons.js";

export const PREFERRED_TIMES = ["weekday-morning", "weekday-afternoon", "weekday-evening", "weekend"];
const ALLOWED_FIELDS = ["lessonId", "name", "email", "preferredTime", "note"];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function findLesson(id) {
  return lessons.find((l) => l.id === id) || null;
}

export function validateCreate(body) {
  const errors = {};

  const unexpected = Object.keys(body).filter((k) => !ALLOWED_FIELDS.includes(k));
  for (const k of unexpected) errors[k] = "unexpected field";

  const { lessonId, name, email, preferredTime, note } = body;

  if (typeof lessonId !== "string" || !lessonId) errors.lessonId = "required string";

  if (typeof name !== "string" || !name.trim()) errors.name = "required string";
  else if (name.trim().length > 80) errors.name = "max 80 characters";

  if (typeof email !== "string" || !email.trim()) errors.email = "required string";
  else if (email.length > 254 || !EMAIL_RE.test(email.trim())) errors.email = "not a valid email";

  if (typeof preferredTime !== "string") errors.preferredTime = "required string";
  else if (!PREFERRED_TIMES.includes(preferredTime)) errors.preferredTime = `must be one of ${PREFERRED_TIMES.join(", ")}`;

  if (note !== undefined && note !== null) {
    if (typeof note !== "string") errors.note = "must be a string";
    else if (note.length > 300) errors.note = "max 300 characters";
  }

  if (Object.keys(errors).length) return { errors };

  return {
    value: {
      lessonId,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      preferredTime,
      note: note ? note.trim() : "",
    },
  };
}

// Never expose the stored token hash.
export function toOwnerView(r) {
  const { manageTokenHash: _hash, ...rest } = r;
  return rest;
}

export const toStaffView = toOwnerView;
