"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useSyncExternalStore } from "react";
import { consentCookie, privacySignal, readConsent } from "@/lib/consent";

// The choice lives in the browser: read it there
function readChoice() {
  const signal = privacySignal({
    doNotTrack: navigator.doNotTrack,
    globalPrivacyControl: navigator.globalPrivacyControl,
  });
  return signal ? "no" : (readConsent(document.cookie) ?? "ask");
}

function subscribe(onChange) {
  window.addEventListener("consent-change", onChange);
  return () => window.removeEventListener("consent-change", onChange);
}

export default function Analytics() {
  const pathname = usePathname();
  const choice = useSyncExternalStore(subscribe, readChoice, () => "loading");

  // A view for each page, after a yes
  useEffect(() => {
    if (choice === "yes") window.trailheadTrack?.(pathname);
  }, [choice, pathname]);

  function decide(value) {
    document.cookie = consentCookie(value);
    window.dispatchEvent(new Event("consent-change"));
  }

  return (
    <>
      {choice === "yes" && (
        <Script
          src="/analytics.js"
          strategy="afterInteractive"
          onLoad={() => window.trailheadTrack(pathname)}
        />
      )}
      {choice === "ask" && (
        <section
          aria-label="Privacy choice"
          className="fixed inset-x-4 bottom-4 z-40 rounded-lg border bg-surface p-4"
        >
          <p>We count page views to improve the site. No cookie identifies you.</p>
          <div className="mt-3 flex gap-3">
            <button
              onClick={() => decide("yes")}
              className="rounded-lg bg-brand-700 px-4 py-2 text-white"
            >
              Accept
            </button>
            <button
              onClick={() => decide("no")}
              className="rounded-lg border px-4 py-2"
            >
              Decline
            </button>
          </div>
        </section>
      )}
    </>
  );
}
