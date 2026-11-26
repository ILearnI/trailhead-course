import { registerOTel } from "@vercel/otel";
import { LogExporter } from "@/lib/log-exporter";
import { addReport } from "@/lib/error-report";
import { describeError } from "@/lib/request-error";
import { log } from "@/lib/logger";

// Runs once, when the server starts
export async function register() {
  // Spans of Next and ours, written to the log
  registerOTel({ serviceName: "trailhead", traceExporter: new LogExporter() });
  if (process.env.NEXT_RUNTIME !== "nodejs") return;
  // Node APIs live in a separate file
  const { startNode } = await import("./instrumentation-node");
  startNode();
}

// Runs for every error that Next catches
export async function onRequestError(error, request, context) {
  const { message, fields } = describeError(error, request, context);
  log.error(message, fields);
  const stack = error.stack?.slice(0, 4000);
  addReport({ kind: "server", message, stack, digest: fields.digest, url: fields.path });
}
