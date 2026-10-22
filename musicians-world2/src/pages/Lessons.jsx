import { useState } from "react";
import { lessons, lessonPolicy } from "../data/lessons";
import { usePageTitle } from "../lib/usePageTitle";

const TIMES = [
  ["weekday-morning", "Weekday morning"],
  ["weekday-afternoon", "Weekday afternoon"],
  ["weekday-evening", "Weekday evening"],
  ["weekend", "Weekend"],
];

const FIELD_HELP = {
  name: "Enter your name.",
  email: "Enter a valid email address.",
  preferredTime: "Choose a preferred time.",
  note: "Keep the note under 300 characters.",
};

function BookingForm({ lesson, onBooked, onCancel }) {
  const [form, setForm] = useState({ name: "", email: "", preferredTime: "", note: "" });
  const [fieldErrors, setFieldErrors] = useState({});
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  async function handleSubmit(e) {
    e.preventDefault();
    setSending(true);
    setMessage("");
    setFieldErrors({});
    try {
      const body = { lessonId: lesson.id, name: form.name, email: form.email, preferredTime: form.preferredTime };
      if (form.note.trim()) body.note = form.note;
      const res = await fetch("/api/lesson-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json().catch(() => ({}));
      if (res.status === 201) return onBooked(data);
      if (res.status === 400 && data.fields) {
        setFieldErrors(data.fields);
        setMessage("Please fix the highlighted fields.");
      } else if (res.status === 409) {
        setMessage("You already have a pending request for this lesson. An instructor will be in touch.");
      } else {
        setMessage("Your request didn't go through. Please try again.");
      }
    } catch {
      setMessage("Couldn't reach the server. Check your connection and try again.");
    } finally {
      setSending(false);
    }
  }

  const err = (key) => fieldErrors[key] && <span className="field-error">{FIELD_HELP[key]}</span>;
  const fid = (key) => `${lesson.id}-${key}`;

  return (
    <form className="booking-form" onSubmit={handleSubmit} noValidate>
      <label htmlFor={fid("name")}>Name</label>
      <input id={fid("name")} value={form.name} onChange={update("name")} autoComplete="name" required />
      {err("name")}

      <label htmlFor={fid("email")}>Email</label>
      <input id={fid("email")} type="email" value={form.email} onChange={update("email")} autoComplete="email" required />
      {err("email")}

      <label htmlFor={fid("time")}>Preferred time</label>
      <select id={fid("time")} value={form.preferredTime} onChange={update("preferredTime")} required>
        <option value="">Choose a time</option>
        {TIMES.map(([value, label]) => (
          <option key={value} value={value}>{label}</option>
        ))}
      </select>
      {err("preferredTime")}

      <label htmlFor={fid("note")}>Note (optional)</label>
      <textarea id={fid("note")} value={form.note} onChange={update("note")} maxLength={300} rows={2} />
      {err("note")}

      {message && <p className="form-message" role="alert">{message}</p>}

      <div className="booking-buttons">
        <button type="submit" className="book-lesson" disabled={sending}>
          {sending ? "Sending…" : "Send request"}
        </button>
        <button type="button" className="text-button" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}

export default function Lessons() {
  usePageTitle("Lessons | Musicians World");
  const [openId, setOpenId] = useState(null);
  const [booked, setBooked] = useState({});

  return (
    <>
      <h1 className="section-heading">Lessons</h1>
      <p className="lesson-intro">
        Book time with an instructor to work on technique, songwriting, or
        recording. All lessons are held in-store or online.
      </p>
      <div className="lesson-list">
        {lessons.map((lesson) => {
          const confirmation = booked[lesson.id];
          return (
            <div className="lesson-card" key={lesson.id}>
              <div className="lesson-info">
                <h2>{lesson.title}</h2>
                <p className="blurb">{lesson.blurb}</p>
                <p className="lesson-policy">{lessonPolicy}</p>
              </div>
              <div className="lesson-actions">
                {confirmation ? (
                  <p className="lesson-confirm" role="status">
                    Request sent for {confirmation.lessonTitle}. We'll email {confirmation.email} to pick a time.
                  </p>
                ) : openId === lesson.id ? (
                  <BookingForm
                    lesson={lesson}
                    onCancel={() => setOpenId(null)}
                    onBooked={(data) => {
                      setBooked((b) => ({ ...b, [lesson.id]: data }));
                      setOpenId(null);
                    }}
                  />
                ) : (
                  <button className="book-lesson" onClick={() => setOpenId(lesson.id)}>
                    Book this lesson
                  </button>
                )}
              </div>
              <div className="lesson-meta">
                <div className="lesson-price">${lesson.price} per lesson</div>
                <div>Level: {lesson.level}</div>
                <div>Duration: {lesson.duration}</div>
                <div>Format: {lesson.format}</div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
