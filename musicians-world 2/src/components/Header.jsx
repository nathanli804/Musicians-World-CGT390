import { NavLink, useNavigate, useSearchParams } from "react-router-dom";
import { track } from "../lib/analytics";

export default function Header() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const currentQuery = searchParams.get("q") || "";

  function handleSubmit(e) {
    e.preventDefault();
    const q = new FormData(e.currentTarget).get("q").toString().trim();
    if (!q) return;
    track("search", { search_term: q });
    navigate(`/browse?q=${encodeURIComponent(q)}`);
  }

  return (
    <header className="site-header">
      <NavLink to="/" className="brand">
        Musicians <span>World</span>
      </NavLink>
      <form className="site-search" role="search" onSubmit={handleSubmit}>
        <input
          key={currentQuery}
          type="search"
          name="q"
          defaultValue={currentQuery}
          placeholder="Search guitars, drums, pedals…"
          aria-label="Search gear"
        />
        <button type="submit">Search</button>
      </form>
      <nav className="site-nav">
        <NavLink to="/" end className={({ isActive }) => (isActive ? "active" : "")}>
          Home
        </NavLink>
        <NavLink to="/browse" className={({ isActive }) => (isActive ? "active" : "")}>
          Browse
        </NavLink>
        <NavLink to="/lessons" className={({ isActive }) => (isActive ? "active" : "")}>
          Lessons
        </NavLink>
      </nav>
    </header>
  );
}
