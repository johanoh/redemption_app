const API_URL = process.env.VITE_API_URL || "http://localhost:3000";

export async function fetchJson(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!res.ok) {
    const message = await res.text();
    throw new Error(`API error: ${res.status} - ${message}`);
  }

  return res.json();
}
