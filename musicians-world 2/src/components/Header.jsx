import { NavLink } from "react-router-dom";

export default function Header() {
  return (
    <header className="site-header">
      <NavLink to="/" className="brand">
        Musicians <span>World</span>
      </NavLink>
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
