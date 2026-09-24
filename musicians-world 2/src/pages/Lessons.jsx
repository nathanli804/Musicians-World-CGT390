import { lessons } from "../data/lessons";
import { usePageTitle } from "../lib/usePageTitle";

export default function Lessons() {
  usePageTitle("Lessons | Musicians World");
  return (
    <>
      <h1 className="section-heading">Lessons</h1>
      <p style={{ maxWidth: "60ch", marginBottom: "1.5rem", color: "#514a3d" }}>
        Book time with an instructor to work on technique, songwriting, or
        recording. All lessons are held in-store or online.
      </p>
      <div className="lesson-list">
        {lessons.map((lesson) => (
          <div className="lesson-card" key={lesson.id}>
            <div>
              <h3>{lesson.title}</h3>
              <p className="blurb">{lesson.blurb}</p>
            </div>
            <div className="lesson-meta">
              <div>Level: {lesson.level}</div>
              <div>Duration: {lesson.duration}</div>
              <div>Format: {lesson.format}</div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
