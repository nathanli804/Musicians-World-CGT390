import { useEffect, useRef } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import Browse from "./pages/Browse";
import ProductDetail from "./pages/ProductDetail";
import Lessons from "./pages/Lessons";
import { track } from "./lib/analytics";
import { skipTo } from "./lib/skipTo";

function BrowseRoute() {
  const location = useLocation();
  return <Browse key={location.search} />;
}

function PageViewTracker() {
  const location = useLocation();
  const lastPath = useRef(null);

  useEffect(() => {
    const path = location.pathname + location.search;
    if (lastPath.current === path) return;
    lastPath.current = path;
    track("page_view", {
      page_title: document.title,
      page_location: window.location.href,
      page_path: path,
    });
  }, [location]);

  return null;
}

export default function App() {
  return (
    <div className="app-shell">
      <a href="#main-content" className="skip-link" onClick={skipTo("main-content")}>
        Skip to main content
      </a>
      <Header />
      <main id="main-content" tabIndex={-1}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/browse" element={<BrowseRoute />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/lessons" element={<Lessons />} />
        </Routes>
      </main>
      <PageViewTracker />
    </div>
  );
}
