// Prints the spans of one request as a tree
import { readFileSync } from "node:fs";

const [file, name] = process.argv.slice(2);
const lines = readFileSync(file, "utf8").split("\n");
const spans = lines
  .filter((line) => line.startsWith("{"))
  .map((line) => JSON.parse(line))
  .filter((event) => event.message === "span");

// Newest request of this name, failed first
const failed = (id) => spans.some((span) => span.traceId === id && span.failed);
const root =
  spans.findLast((span) => span.name.includes(name) && failed(span.traceId)) ??
  spans.findLast((span) => span.name.includes(name));
const trace = spans.filter((span) => span.traceId === root.traceId);

function print(span, depth) {
  const mark = span.failed ? " FAILED" : "";
  console.log(`${"  ".repeat(depth)}${span.name} (${span.ms} ms)${mark}`);
  for (const child of trace.filter((item) => item.parentId === span.spanId)) {
    print(child, depth + 1);
  }
}
print(root, 0);
