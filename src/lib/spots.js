const API = "http://localhost:4002";

export async function checkSpots(hikers) {
  const response = await fetch(`${API}/spots?hikers=${hikers}`);
  // Expected: a rule of the business, not a crash
  if (response.status === 409) {
    const body = await response.json();
    return { ok: false, message: body.error };
  }
  if (!response.ok) throw new Error(`Spots API: ${response.status}`);
  return { ok: true, ...(await response.json()) };
}
