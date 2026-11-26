import { SpanStatusCode, trace } from "@opentelemetry/api";

const tracer = trace.getTracer("trailhead");

// Run a function inside a span of our own
export function withSpan(name, attributes, work) {
  return tracer.startActiveSpan(name, { attributes }, async (span) => {
    try {
      return await work();
    } catch (error) {
      span.recordException(error);
      span.setStatus({ code: SpanStatusCode.ERROR });
      throw error;
    } finally {
      span.end();
    }
  });
}
