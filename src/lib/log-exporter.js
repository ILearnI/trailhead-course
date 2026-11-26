import { SpanStatusCode } from "@opentelemetry/api";
import { ExportResultCode } from "@opentelemetry/core";
import { log } from "@/lib/logger";

// Writes each finished span as a line of the log
export class LogExporter {
  export(spans, done) {
    for (const span of spans) {
      log.info("span", {
        name: span.name,
        traceId: span.spanContext().traceId,
        spanId: span.spanContext().spanId,
        parentId: span.parentSpanContext?.spanId,
        ms: Math.round(span.duration[0] * 1000 + span.duration[1] / 1e6),
        failed: span.status.code === SpanStatusCode.ERROR,
      });
    }
    done({ code: ExportResultCode.SUCCESS });
  }

  shutdown() {
    return Promise.resolve();
  }
}
