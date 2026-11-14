import { Route, Routes, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { PageShell } from "./components";
import { AboutPage, BlogArticlePage, BlogsPage, GroundWorkPage, HomePage, ResearchPage } from "./pages";

function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      requestAnimationFrame(() => document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: "smooth" }));
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [pathname, hash]);
  return null;
}

export default function App() {
  return <PageShell><ScrollToTop /><Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/research" element={<ResearchPage />} />
    <Route path="/ground-work" element={<GroundWorkPage />} />
    <Route path="/blogs" element={<BlogsPage />} />
    <Route path="/blogs/:slug" element={<BlogArticlePage />} />
    <Route path="/about" element={<AboutPage />} />
    <Route path="*" element={<div className="not-found"><h1>Page not found</h1><a href="/">Return home</a></div>} />
  </Routes></PageShell>;
}
