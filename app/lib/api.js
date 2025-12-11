// Detecta ambiente automáticamente
const isLocal = typeof window !== "undefined" && window.location.hostname === "localhost";

// API_URL dinámica
export const API_URL = isLocal
  ? "http://localhost:5001"                         // Backend local
  : process.env.NEXT_PUBLIC_API_URL || "";          // Backend en producción

// Wrapper para fetch
export async function apiFetch(endpoint, options = {}) {
  const url = `${API_URL}${endpoint}`;

  const config = {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    },
    ...options
  };

  const res = await fetch(url, config);

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Error API ${res.status}: ${errorText}`);
  }

  return await res.json();
}
