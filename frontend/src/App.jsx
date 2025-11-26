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

  const onSearch = async () => {
    const res = await factCheck(q);
    setResults(res.claims || []);
  };
  //Request Section

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
