"use client";

import { useReportWebVitals } from "next/web-vitals";
import { readConsent } from "@/lib/consent";

// Real visitors measure for us, if they agreed
export default function WebVitals() {
  useReportWebVitals((metric) => {
    if (readConsent(document.cookie) !== "yes") return;
    const { name, value, rating } = metric;
    navigator.sendBeacon("/api/vitals", JSON.stringify({ name, value, rating }));
  });
  return null;
}
