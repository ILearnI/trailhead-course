import { sendReport } from "@/lib/send-report";

// Runs in the browser, before the app starts
performance.mark("trailhead:boot");

// Errors that nobody caught
window.addEventListener("error", (event) => sendReport(event.error ?? event.message));
window.addEventListener("unhandledrejection", (event) => sendReport(event.reason));

// Runs when a client navigation begins
export function onRouterTransitionStart(url, navigationType) {
  performance.mark(`trailhead:navigate:${navigationType}`, { detail: { url } });
}
