import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const slides = [
  {
    id: "gear",
    heading: "Every instrument has a next step.",
    text: "Browse gear by category and price, or book a lesson to get more out of what you already own.",
    cta: "Browse gear",
    to: "/browse",
    image: "/hero.jpg",
  },
  {
    id: "lessons",
    heading: "Lessons for every level.",
    text: "One-on-one and small-group lessons, from first chords to home recording. Prices are listed up front.",
    cta: "See lessons",
    to: "/lessons",
    image: "/hero-2.jpg",
  },
  {
    id: "tone",
    heading: "Find your sound.",
    text: "Overdrive, reverb, and tube amps that sound great at bedroom volume.",
    cta: "Shop pedals & amps",
    to: `/browse?category=${encodeURIComponent("Pedals & Amps")}`,
    image: "/hero-3.jpg",
  },
];

const INTERVAL = 6000;

function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export default function HeroSlider() {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(() => !prefersReducedMotion());
  const [paused, setPaused] = useState(false);

  const go = (next) => setIndex((next + slides.length) % slides.length);

  useEffect(() => {
    if (!playing || paused) return;
    const timer = setInterval(() => setIndex((i) => (i + 1) % slides.length), INTERVAL);
    return () => clearInterval(timer);
  }, [playing, paused]);

  return (
    <section
      className="hero"
      aria-roledescription="carousel"
      aria-label="Featured"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setPaused(false);
      }}
    >
      <div className="hero-track">
        {slides.map((slide, i) => {
          const active = i === index;
          const Heading = i === 0 ? "h1" : "h2";
          return (
            <div
              key={slide.id}
              className={`hero-slide${active ? " is-active" : ""}`}
              style={{ "--slide-image": `url(${slide.image})` }}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${slides.length}`}
              aria-hidden={!active}
              inert={!active}
            >
              <div className="hero-content">
                <Heading className="hero-heading">{slide.heading}</Heading>
                <p>{slide.text}</p>
                <Link to={slide.to} className="hero-cta">
                  {slide.cta}
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      <div className="hero-controls">
        <button className="hero-arrow" onClick={() => go(index - 1)} aria-label="Previous slide">
          ‹
        </button>
        <div className="hero-dots">
          {slides.map((slide, i) => (
            <button
              key={slide.id}
              className={`hero-dot${i === index ? " is-active" : ""}`}
              onClick={() => go(i)}
              aria-label={`Show slide ${i + 1}`}
              aria-current={i === index}
            />
          ))}
        </div>
        <button className="hero-arrow" onClick={() => go(index + 1)} aria-label="Next slide">
          ›
        </button>
        <button
          className="hero-pause"
          onClick={() => setPlaying((p) => !p)}
          aria-label={playing ? "Pause slideshow" : "Play slideshow"}
        >
          {playing ? "Pause" : "Play"}
        </button>
      </div>
    </section>
  );
}
