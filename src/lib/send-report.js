// From the browser: it must never throw itself
export function sendReport(error) {
  try {
    const body = JSON.stringify({
      message: String(error?.message ?? error).slice(0, 500),
      stack: error?.stack?.slice(0, 4000),
      url: location.pathname,
      digest: error?.digest,
    });
    navigator.sendBeacon("/api/errors", new Blob([body], { type: "application/json" }));
  } catch {}
}
