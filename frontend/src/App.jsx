import React, { useState, useEffect } from "react";
import { factCheck, getClaims } from "./services/api";
import { Link } from "react-router-dom";

function App() {
  const [q, setQ] = useState("");
  const [results, setResults] = useState([]); //single input check
  const [claims, setClaims] = useState([]); //automatic generated Claims

  // Request Section
  useEffect(() => {
    getClaims().then((r) => setClaims(r.claims || []));
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
  //Request Section

  const onKeyDown = (e) => {
    if (e.key === "Enter") runSearch();
  };

  const visibleClaims = (claims || []).slice(0, 5);

  return (
    <div style={{ padding: 20 }}>
      <h1>TruthGuard.AI — Search</h1>
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="type a claim"
      />
      <button onClick={onSearch}>Search</button>

      <h2>Results</h2>
      <ul>
        {results.map((r, i) => (
          <li key={i}>
            <strong>{r.text}</strong>
            <div>
              {JSON.stringify(
                r.claimReview?.[0]?.textualRating || r.claimReview
              )}
            </div>
            {r.claimReview?.[0]?.url && (
              <a href={r.claimReview?.[0]?.url} target="_blank" rel="noopener noreferrer">
                Read Full Fact Check
              </a>
            )}
          </li>
        ))}
      </ul>

      <h2>Live Feed</h2>
      <ul>
        {claims.map((c) => (
          <li key={c._id}>
            {c.text} — {c.status}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;

