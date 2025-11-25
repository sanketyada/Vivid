const API = 'http://localhost:8000/api';

export async function factCheck(query) {
  const res = await fetch(`${API}/factcheck/search?q=${encodeURIComponent(query)}`);
  return res.json();
}

export async function getClaims() {
  const res = await fetch(`${API}/claims`);
  return res.json();
}
