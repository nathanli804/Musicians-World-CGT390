import { useState } from "react";
import { lessons, lessonPolicy } from "../data/lessons";
import { usePageTitle } from "../lib/usePageTitle";

export default function Lessons() {
  usePageTitle("Lessons | Musicians World");
  const [requested, setRequested] = useState([]);

  const requestLesson = (id) => {
    setRequested((prev) => (prev.includes(id) ? prev : [...prev, id]));
  };

  return (
    <>
      <h1 className="section-heading">Lessons</h1>
      <p className="lesson-intro">
        Book time with an instructor to work on technique, songwriting, or
        recording. All lessons are held in-store or online.
      </p>
      <div className="lesson-list">
        {lessons.map((lesson) => {
          const isRequested = requested.includes(lesson.id);
          return (
            <div className="lesson-card" key={lesson.id}>
              <div className="lesson-info">
                <h2>{lesson.title}</h2>
                <p className="blurb">{lesson.blurb}</p>
                <p className="lesson-policy">{lessonPolicy}</p>
              </div>
              <div className="lesson-actions">
                <button
                  className="book-lesson"
                  onClick={() => requestLesson(lesson.id)}
                  disabled={isRequested}
                >
                  {isRequested ? "Booking requested" : "Book this lesson"}
                </button>
                {isRequested && (
                  <p className="lesson-confirm" role="status">
                    Booking requested for {lesson.title}. An instructor will contact you to
                    pick a time.
                  </p>
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
