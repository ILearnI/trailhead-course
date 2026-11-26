// The address of the mock API
const API = "http://localhost:4002";

export async function fetchTrails(delay = 0) {
  // Runs on the server: no CORS,
  // and no key in the browser
  const response = await fetch(`${API}/trails?delay=${delay}`);
  return response.json();
}

export async function fetchTrail(slug, delay = 0) {
  const response = await fetch(`${API}/trails/${slug}?delay=${delay}`);
  // The API answers 404 for an unknown slug
  if (!response.ok) return null;
  return response.json();
}

export async function fetchCount(key) {
  const response = await fetch(`${API}/count?key=${key}`);
  return response.json();
}

export async function fetchFlaky() {
  const response = await fetch(`${API}/flaky`);
  if (!response.ok) throw new Error(`Flaky API: ${response.status}`);
  return response.json();
}

export async function fetchSuggestion(id) {
  const response = await fetch(`${API}/suggestions?id=${id}`);
  if (!response.ok) return null;
  return response.json();
}

export async function fetchClosures() {
  const response = await fetch(`${API}/closures`, { cache: "no-store" });
  return response.json();
}

export async function fetchReviews(slug) {
  const response = await fetch(`${API}/reviews?trail=${slug}`);
  return response.json();
}
