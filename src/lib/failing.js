const API = "http://localhost:4002";

// No check: a 500 looks like data
export async function loadUnsafe() {
  const response = await fetch(`${API}/trails?fail=1`);
  return response.json();
}

// Check the status, and throw a useful error
export async function loadSafe(path) {
  const response = await fetch(`${API}${path}`, {
    // Give up after 3 seconds
    signal: AbortSignal.timeout(3000),
  });
  if (!response.ok) throw new Error(`API ${response.status}: ${path}`);
  return response.json();
}
