import { z } from "zod";

// A report: short, and no personal data
export const reportSchema = z.object({
  message: z.string().max(500),
  stack: z.string().max(4000).optional(),
  url: z.string().max(300).optional(),
  digest: z.string().max(40).optional(),
});

// The query and the hash can hold personal data
export function scrub(url) {
  return new URL(url, "http://localhost").pathname;
}

const MAX = 50;
const reports = (globalThis.errorReports ??= []);

export function addReport(report) {
  reports.unshift({ ...report, at: new Date().toISOString() });
  reports.length = Math.min(reports.length, MAX);
}

export function listReports() {
  return reports.slice();
}

export function clearReports() {
  reports.length = 0;
}
