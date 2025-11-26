// import React, { useState, useEffect } from 'react';
// import { factCheck, getClaims } from './services/api';
// import Navbar from './components/Navbar';
// import Sidebar from './components/Sidebar';
// import './styles/navbar.css';

// function App(){
//   const [q, setQ] = useState('');
//   const [results, setResults] = useState([]);
//   const [claims, setClaims] = useState([]);
//   const [menuOpen, setMenuOpen] = useState(false);

//   useEffect(() => {
//     getClaims().then(r => setClaims(r.claims || []));
//   }, []);

//   // small helper: add body class while menu is open
//   useEffect(() => {
//     if (menuOpen) document.body.classList.add('menu-open');
//     else document.body.classList.remove('menu-open');
//     return () => document.body.classList.remove('menu-open');
//   }, [menuOpen]);

//   const onSearch = async () => {
//     const res = await factCheck(q);
//     setResults(res.claims || []);
//   };

//   return (
//     <>
//       <Navbar onToggleMenu={() => setMenuOpen(v => !v)} />
//       <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} />

//       {/* overlay: covers entire viewport and closes sidebar when clicked */}
//       {menuOpen && (
//         <div
//           onClick={() => setMenuOpen(false)}
//           style={{
//             position: 'fixed',
//             inset: 0,
//             zIndex: 1300,
//             background: 'rgba(0,0,0,0.32)'
//           }}
//         />
//       )}

//       <main style={{ padding: 22, paddingTop: 140 }}>
//         <h1>TruthGuard.AI — Search</h1>

//         <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 18 }}>
//           <input
//             value={q}
//             onChange={e => setQ(e.target.value)}
//             placeholder="type a claim"
//             style={{ padding: '8px 10px', flex: 1, borderRadius: 8, border: '1px solid #ddd' }}
//           />
//           <button onClick={onSearch} style={{ padding: '8px 12px', borderRadius: 8 }}>
//             Search
//           </button>
//         </div>

//         <h2>Results</h2>
//         <ul>
//           {results.map((r,i) => (
//             <li key={i} style={{ marginBottom: 10 }}>
//               <strong>{r.text}</strong>
//               <div>{JSON.stringify(r.claimReview?.[0]?.textualRating || r.claimReview)}</div>
//             </li>
//           ))}
//         </ul>

//         <h2>Live Feed</h2>
//         <ul>
//           {claims.map(c => (
//             <li key={c._id}>{c.text} — {c.status}</li>
//           ))}
//         </ul>
//       </main>
//     </>
//   );
// }

// export default App;

import React, { useState, useEffect } from "react";
import { factCheck, getClaims } from "./services/api";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import "./styles/navbar.css";

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
      <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} />

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
      <main className="content layout-right" role="main">
        {/* 1. SEARCH BAR  */}
        <div className="search-area" role="region" aria-label="Quick verify">
          <div className="search-inner">
            <div className="quick-label">Quick Verify</div>
            <input
              aria-label="Quick verify input"
              className="quick-input"
              placeholder="Type claim or paste text / url..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={onKeyDown}
              autoComplete="off"
            />
            <button
              className="quick-btn"
              onClick={runSearch}
              aria-label="Run search"
              type="button"
            >
              {loading ? "Searching…" : "Search"}
            </button>
          </div>
        </div>

        {/* 2. RESULTS (just under search) */}
        <section className="results-section" aria-label="Search results">
          <h2 className="section-title">Results</h2>

          {loading && <div className="loader">Searching…</div>}

          {!loading && !searched && (
            <div className="results-empty">
              No results yet. Try searching above.
            </div>
          )}

          {!loading && searched && results.length === 0 && (
            <div className="results-empty">
              No results found for your query.
            </div>
          )}

          {!loading && results.length > 0 && (
            <ul className="results-list">
              {results.map((r, idx) => (
                <li key={idx} className="result-card">
                  <div className="result-text">{r.text}</div>
                  <div className="result-meta">
                    {r.claimReview?.[0]?.textualRating ||
                      r.claimReview?.[0]?.title ||
                      ""}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* 3. LIVE NEWS (under results, always visible section) */}
        <section className="live-results" aria-label="Live results">
          <h2 className="section-title live-title">Live News</h2>

          <ul className="live-list" aria-live="polite">
            {visibleClaims.length === 0 && (
              <li className="live-empty">No live items available</li>
            )}
            {visibleClaims.map((c, i) => (
              <li key={c._id || i} className="live-item">
                <div className="live-text">{c.text}</div>
                {c.status && <div className="live-meta">{c.status}</div>}
              </li>
            ))}
          </ul>
        </section>

        {/* 4. BOTTOM CARDS (PIB + Live) */}
        <section className="cards-grid" aria-label="PIB and Live cards">
          <div className="card card-pib">
            <div>
              <h3>PIB Verified</h3>
              <p>
                Official Public Information Bulletin highlights — authoritative
                clarifications and verified releases.
              </p>
            </div>
            <div>
              <a className="card-btn" href="#pib">
                Open PIB
              </a>
            </div>
          </div>

          <div className="card card-live">
            <div>
              <h3>Live Discussions</h3>
              <p>
                Join real-time conversations around trending claims and
                evidence.
              </p>
            </div>
            <div>
              <a className="card-btn" href="#live">
                Open Live
              </a>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

export default App;

