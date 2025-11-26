import React, { useState, useEffect } from "react";
import { factCheck, getClaims } from "./services/api";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
// import "./styles/navbar.css";

function App() {
  const [q, setQ] = useState("");
  const [results, setResults] = useState([]);
  const [claims, setClaims] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    getClaims()
      .then((r) => setClaims(r.claims || []))
      .catch(() => setClaims([]));
  }, []);

  useEffect(() => {
    if (menuOpen) document.body.classList.add("menu-open");
    else document.body.classList.remove("menu-open");
    return () => document.body.classList.remove("menu-open");
  }, [menuOpen]);

  const runSearch = async () => {
    if (!q || !q.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      const res = await factCheck(q);
      setResults(res.claims || []);
    } catch (err) {
      console.error("Search error", err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter") runSearch();
  };

  const visibleClaims = (claims || []).slice(0, 5);

  return (
    <>
      <Navbar onToggleMenu={() => setMenuOpen((v) => !v)} />

      {menuOpen && (
        <div
          onClick={() => setMenuOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 1300,
            background: "rgba(0,0,0,0.32)",
          }}
        />
      )}

      {/* MAIN CONTENT */}
<main className="content layout-right relative min-h-screen bg-gray-50">
  {/* Sidebar */}
  <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} />

  <div className="p-6 max-w-4xl mx-auto">

    {/* SEARCH AREA */}
    <div
      className="bg-white rounded-xl shadow p-5 mb-8"
      role="region"
      aria-label="Quick verify"
    >
      <div className="text-lg font-semibold mb-3">Quick Verify</div>

      <div className="flex gap-3">
        <input
          aria-label="Quick verify input"
          className="flex-1 border border-gray-300 rounded-md px-3 py-2 
                     focus:ring-2 focus:ring-blue-300 focus:border-blue-500 outline-none"
          placeholder="Type claim or paste text / url..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={onKeyDown}
          autoComplete="off"
        />

        <button
          className="px-5 py-2 rounded-md bg-blue-600 text-white font-medium 
                     hover:bg-blue-700 transition"
          onClick={runSearch}
          type="button"
          aria-label="Run search"
        >
          {loading ? "Searching…" : "Search"}
        </button>
      </div>
    </div>

    {/* RESULTS SECTION */}
    <section
      className="bg-white rounded-xl shadow p-6 mb-10"
      aria-label="Search results"
    >
      <h2 className="text-2xl font-semibold mb-4">Results</h2>

      {loading && <div className="text-gray-500">Searching…</div>}

      {!loading && !searched && (
        <div className="text-gray-500">No results yet. Try searching above.</div>
      )}

      {!loading && searched && results.length === 0 && (
        <div className="text-gray-500">No results found for your query.</div>
      )}

      {!loading && results.length > 0 && (
        <ul className="space-y-4">
          {results.map((r, idx) => (
            <li
              key={idx}
              className="border border-gray-200 rounded-lg p-4 shadow-sm 
                         hover:shadow transition"
            >
              <div className="text-gray-800 font-medium mb-2">{r.text}</div>

              <div className="text-sm text-gray-600 mb-2">
                {r.claimReview?.[0]?.textualRating ||
                  r.claimReview?.[0]?.title ||
                  ""}
              </div>

              {r.claimReview?.[0]?.url && (
                <a
                  href={r.claimReview?.[0]?.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 text-sm font-medium hover:underline"
                >
                  Read Full Fact Check →
                </a>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>

    {/* LIVE NEWS SECTION */}
    <section className="bg-white rounded-xl shadow p-6" aria-label="Live results">
      <h2 className="text-2xl font-semibold mb-4">Live News</h2>

      <ul className="space-y-3" aria-live="polite">
        {visibleClaims.length === 0 && (
          <li className="text-gray-500">No live items available</li>
        )}

        {visibleClaims.map((c, i) => (
          <li
            key={c._id || i}
            className="border border-gray-200 rounded-lg p-3 shadow-sm"
          >
            <div className="text-gray-800 font-medium">{c.text}</div>
            {c.status && (
              <div className="text-sm text-gray-600 mt-1">{c.status}</div>
            )}
          </li>
        ))}
      </ul>
    </section>
  </div>

  {/* FIXED BOTTOM BUTTONS */}

</main>

    </>
  );
}

export default App;
